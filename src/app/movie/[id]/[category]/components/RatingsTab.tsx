import { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { rate, RateState } from '@/app/movie/lib/actions';
import styles from "./components.module.css";
import { UserWithMovieIds } from '@/types/user';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { StarRating } from './StarRating';

interface RatingsTabProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

export default function RatingsTab({ movie, userWithMovieIds, category }: RatingsTabProps) {
  const initialState: RateState = {
    error: {},
    message: ""
  }
  const { user, rate_movieIds } = userWithMovieIds;
  const isLogin = user !== null;
  const isRated = rate_movieIds.includes(Number(movie.theMovieDbId));
  const [rating, setRating] = useState(0);
  const [rateState, rateAction] = useActionState(rate, initialState);
  const renderError = () => {
    if (typeof rateState.error === 'string') {
      return <p className={styles.error}>{rateState.error}</p>;
    } else if (rateState.error) {
      return (
        <ul className={styles.errorList}>
          {Object.entries(rateState.error).map(([key, errors]) => (
            errors && errors.map((error, index) => (
              <li key={`${key}-${index}`} className={styles.errorItem}>{error}</li>
            ))
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div role="tabpanel" aria-label="평점 탭">
      <p>평점: {movie.voteAverage ? movie.voteAverage.toFixed(1) : 0}</p>
      {isLogin && !isRated && (
        <div>
          <form
            action={rateAction}
            className={styles.ratingForm}
            aria-label="평점 입력 폼"
          >
            <StarRating rating={rating} setRating={setRating} />
            <input type="hidden" name="movie_id" value={movie.id} />
            <input type="hidden" name="user_id" value={user.id} />
            <input type="hidden" name="the_movie_db_id" value={movie.theMovieDbId} />
            <input type="hidden" name="category" value={category} />
            <button
              type="submit"
              aria-label="평점 제출하기"
              disabled={rating === 0}
            >
              평점 남기기
            </button>
          </form>
          {renderError()}
          {rateState.message && (
            <p className={styles.message} role="alert">
              {rateState.message}
            </p>
          )}
        </div>
      )}
      {isRated && (
        <p className={styles.rated} role="alert">
          이미 평점을 매겼습니다.
        </p>
      )}
      {!isLogin && (
        <Link
          href="/login"
          className={styles.rated}
          aria-label="로그인 페이지로 이동"
        >
          로그인 후 이용해주세요.
        </Link>
      )}
    </div>
  );
}
