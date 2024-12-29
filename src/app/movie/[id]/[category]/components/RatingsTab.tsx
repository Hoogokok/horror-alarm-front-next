import { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { rate } from '@/app/movie/lib/actions';
import styles from "./components.module.css";
import { UserWithMovieIds } from '@/types/user';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { StarRating } from './StarRating';
import { RATING_MESSAGES, FORM_LABELS } from '@/constants/rating';
import { renderError } from '@/utils/error';
import { RateErrorState } from '@/types/error';

interface RatingsTabProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

export default function RatingsTab({ movie, userWithMovieIds, category }: RatingsTabProps) {
  const initialState: RateErrorState = {
    error: undefined,
    message: ""
  };

  const { user, rate_movieIds } = userWithMovieIds;
  const isLogin = user !== null;
  const isRated = rate_movieIds.includes(Number(movie.theMovieDbId));
  const [rating, setRating] = useState(0);
  const [rateState, rateAction] = useActionState(rate, initialState);

  return (
    <div role="tabpanel" aria-label={FORM_LABELS.RATING_TAB}>
      <p>평점: {movie.voteAverage ? movie.voteAverage.toFixed(1) : 0}</p>
      {isLogin && !isRated && (
        <div>
          <form
            action={rateAction}
            className={styles.ratingForm}
            aria-label={FORM_LABELS.RATING_FORM}
          >
            <StarRating rating={rating} setRating={setRating} />
            <input type="hidden" name="movie_id" value={movie.id} />
            <input type="hidden" name="user_id" value={user.id} />
            <input type="hidden" name="the_movie_db_id" value={movie.theMovieDbId} />
            <input type="hidden" name="category" value={category} />
            <button
              type="submit"
              aria-label={FORM_LABELS.SUBMIT_BUTTON}
              disabled={rating === 0}
            >
              {RATING_MESSAGES.SUBMIT_RATING}
            </button>
          </form>
          {renderError(rateState.error)}
          {rateState.message && (
            <p className={styles.message} role="alert">
              {rateState.message}
            </p>
          )}
        </div>
      )}
      {isRated && (
        <p className={styles.rated} role="alert">
          {RATING_MESSAGES.ALREADY_RATED}
        </p>
      )}
      {!isLogin && (
        <Link
          href="/login"
          className={styles.rated}
          aria-label={FORM_LABELS.LOGIN_LINK}
        >
          {RATING_MESSAGES.LOGIN_REQUIRED}
        </Link>
      )}
    </div>
  );
}
