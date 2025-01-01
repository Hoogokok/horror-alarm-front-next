import { Movie } from '@/types/movie';
import { MovieDetailResponseDto, Review } from '@/types/movie-detail-response-dto';
import { supabase } from '@/utils/supabase/client'

const API_BASE_URL = process.env.MOVIE_API;
const API_KEY = process.env.MOVIE_API_KEY;

async function fetchAPI<T>(
  endpoint: string,
  params: Record<string, string> = {},
  options?: { cache?: 'no-store' | 'force-cache' }
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => 
    url.searchParams.append(key, value)
  );

  const response = await fetch(url.toString(), {
    headers: {
      'X-API-KEY': API_KEY as string
    },
    ...(!options?.cache && { next: { revalidate: 3600 } }),
    ...(options?.cache && { cache: options.cache })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = errorBody.message || response.statusText;
    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;
    console.error(`API 요청 실패: ${error.message}`);
    throw error;
  }

  return response.json();
}

export async function fetchStreamingMovies(provider: string, page: string): Promise<Movie[]> {
  return fetchAPI<Movie[]>('/movies/streaming', { provider, page });
}

export async function fetchTotalPages(provider: string): Promise<{ totalPages: number }> {
  return fetchAPI<{ totalPages: number }>('/movies/streaming/pages', { provider });
}

export async function fetchMovieDetail(category: string, id: string): Promise<MovieDetailResponseDto> {
  const endpoint = getMovieEndpoint(category, id);
  const movieData = await fetchAPI<MovieDetailResponseDto>(endpoint);
  return movieData;
}

export async function fetchMovieReviews(category: string, id: string, page: number): Promise<Review[]> {
  const response = await fetch(
    `/api/reviews?category=${category}&movieId=${id}&page=${page}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '리뷰를 불러오는데 실패했습니다.');
  }

  return response.json();
}

function getMovieEndpoint(category: string, id: string): string {
  switch (category) {
    case 'streaming':
      return `/movies/streaming/${id}`;
    case 'upcoming':
    case 'released':
      return `/movies/theater/${id}`;
    case 'expiring':
      return `/movies/expiring-horror/${id}`;
    default:
      throw new Error('Invalid category');
  }
}

export async function searchMovies(provider: string, page: string, search: string): Promise<{ totalPages: number, movies: Movie[] }> {
    const pageSize = 18
    const pageNumber = parseInt(page, 10)
    const startIndex = (pageNumber - 1) * pageSize
    const providerId = getProviderId(provider)

    let query = supabase
        .from('movie')
        .select(`
            id,
            title,
            poster_path,
            movie_providers!inner (
                the_provider_id
            )
        `, { count: 'exact' })

     if (providerId !== 0) {
        query = query.eq('movie_providers.the_provider_id', providerId)
    }


    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    const { data: movies, count, error } = await query
        .range(startIndex, startIndex + pageSize - 1)
        .order('title')

    if (error) {
        console.error('Error fetching movies:', error)
        throw error
    }

    const totalPages = Math.ceil((count || 0) / pageSize)

    return { 
        totalPages, 
        movies: movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
        })) || [] 
    }
}

function getProviderId(provider: string): number {
  switch (provider.toLowerCase()) {
      case 'netflix': return 1;
      case 'disney': return 2;
      case 'wavve': return 3;
      case 'naver': return 4;
      case 'googleplay': return 5;
      default: return 0; // 'all' 또는 알 수 없는 제공자의 경우
  }
}

