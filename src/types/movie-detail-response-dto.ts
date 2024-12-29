export interface MovieDetailResponseDto {
  id: string;
  title: string;
    posterPath: string;
  overview: string;
  releaseDate: string;
  runtime: number;
    voteAverage: number;
  voteCount: number;
    theMovieDbId: string;
  providers?: {
    id: number;
    name: string;
  }[];
  reviews?: Review[];
  ratings?: {
    id: string;
    score: number;
    rate_user_id: string;
    rate_movie_id: string;
    created_at: string;
    profile?: {
      id: string;
      name: string;
    };
  }[];
}

export interface Review {
    id: string;
  review_content: string;
  review_user_id: string;
  review_movie_id: string;
  created_at: string;
    profile?: {
      id: string;
      name: string;
    };
}