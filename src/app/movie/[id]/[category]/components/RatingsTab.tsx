import { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { rate, RateState } from '@/app/movie/lib/actions';
import styles from "./components.module.css";
import { UserWithMovieIds } from '@/types/user';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';

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
  const isRated = rate_movieIds.includes(movie.theMovieDbId.toString());
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
    <div>
      <p>평점: {movie.voteAverage ? movie.voteAverage.toFixed(1) : 0}</p>
      {isLogin && !isRated && (
        <div>
          <form action={rateAction} className={styles.ratingForm}>
            <StarRating rating={rating} setRating={setRating} />
            <input type="hidden" name="movie_id" value={movie.id} />
            <input type="hidden" name="user_id" value={user.id} />
            <input type="hidden" name="the_movie_db_id" value={movie.theMovieDbId} />
            <input type="hidden" name="category" value={category} />
            <button type="submit">평점 남기기</button>
          </form>
          {renderError()}
          {rateState.message && <p className={styles.message}>{rateState.message}</p>}
        </div>
      )}
      {isRated && <p className={styles.rated}>이미 평점을 매겼습니다.</p>}
      {!isLogin && <Link href="/login" className={styles.rated}>로그인 후 이용해주세요.</Link>}
    </div>
  );
}

const StarRating = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void }) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star}>
          <input
            type="radio"
            name="rating"
            value={star}
            checked={rating === star}
            onChange={() => setRating(star)}
            style={{ display: 'none' }}
          />
          <span className={star <= rating ? styles.filled : ''}>★</span>
        </label>
      ))}
    </div>
  );
};
