import { Movie } from '@/\btypes/movie';

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
