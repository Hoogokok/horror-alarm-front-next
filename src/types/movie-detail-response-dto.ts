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
    theMovieDbId: string;
    reviews: Review[];
  }

  export interface Review {
    id: string;
    content: string;
    createdAt: string;
    profile?: {
      id: string;
      name: string;
    };
  }