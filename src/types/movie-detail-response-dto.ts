export interface MovieDetailResponseDto {
    id: number;
    title: string;
    overview: string;
    releaseDate?: string;
    expiringDate?: string;
    posterPath: string;
    voteAverage: number;
    voteCount: number;
    providers?: string[];
    theMovieDbId: number;
    reviews: string[];
  }