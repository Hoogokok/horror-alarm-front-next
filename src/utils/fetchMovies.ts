import { MovieResponseDto } from "../app/types/movie-response-dto";
import { ExpiringMovieResponseDto } from "../app/types/expiring-response-dto";

async function fetchMovies<T>(endpoint: string): Promise<T> {
  const response = await fetch(process.env.MOVIE_API + endpoint, {
    next: { revalidate: 3600 },
    headers: {
      'X-API-Key': process.env.MOVIE_API_KEY as string
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchUpcomingMovies(): Promise<MovieResponseDto[]> {
  return fetchMovies<MovieResponseDto[]>('/movies/theater/upcoming');
}

export async function fetchNowPlayingMovies(): Promise<MovieResponseDto[]> {
  return fetchMovies<MovieResponseDto[]>('/movies/theater/released');
}

export async function fetchExpiringMovies(): Promise<ExpiringMovieResponseDto[]> {
  return fetchMovies<ExpiringMovieResponseDto[]>('/movies/expiring-horror');
}