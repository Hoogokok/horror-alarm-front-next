import { Movie } from '@/\btypes/movie';
import { MovieDetailResponseDto } from '@/\btypes/movie-detail-response-dto';
import { supabase } from '@/utils/supabase/client'

const API_BASE_URL = process.env.MOVIE_API;
const API_KEY = process.env.MOVIE_API_KEY;

async function fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => 
    url.searchParams.append(key, value)
  );

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: {
      'X-API-Key': API_KEY as string
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
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
  return fetchAPI<MovieDetailResponseDto>(endpoint);
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

    let query = supabase
        .from('movie')
        .select('*', { count: 'exact' })

    if (provider !== 'all') {
        query = query.contains('providers', [provider])
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

    return { totalPages, movies: movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
    })) || [] }
}