import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { UserWithMovieIds } from '@/types/user';
import { review, ReviewState } from '@/app/movie/lib/actions';
import { usePagination } from '@/hooks/usePagination';
import Link from 'next/link';
import { useActionState } from 'react';
import styles from "./components.module.css";

interface ReviewsTabProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

export default function ReviewsTab({ movie, userWithMovieIds, category }: ReviewsTabProps) {
  const initialState: ReviewState = {
    error: {},
    message: ""
  }
  const { user, review_movieIds } = userWithMovieIds;
  const isLogin = user !== null;
  const isReviewed = review_movieIds.includes(Number(movie.theMovieDbId));
  const [reviewState, reviewAction] = useActionState(review, initialState);
  const { currentItems: currentReviews, currentPage, nextPage, prevPage, totalPages } = usePagination(movie.reviews);
  const renderError = () => {
    if (typeof reviewState.error === 'string') {
      return <p className={styles.error}>{reviewState.error}</p>;
    } else if (reviewState.error) {
      return (
        <ul className={styles.errorList}>
          {Object.entries(reviewState.error).map(([key, errors]) => (
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
    <div className={styles.review}>
     <ul>
        {currentReviews.map((review) => (
          <li key={review.id}>
            <p>{review.content}</p>
            <small>{new Date(review.createdAt).toLocaleDateString('ko-KR')}</small>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>{currentPage}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>

      {isLogin && !isReviewed ? (
        <div className={styles.reviewForm}>
          <h3 className={styles.reviewTitle}>리뷰 작성하기</h3>
          <form action={reviewAction} className={styles.reviewForm} role='form'>
            <textarea 
              name='review'
              placeholder="이 영화에 대한 리뷰를 작성해주세요..." 
              className={styles.reviewInput}
              required
            />
            <input type="hidden" name="movie_id" value={movie.id} />
            <input type="hidden" name="user_id" value={user.id} />
            <input type="hidden" name="the_movie_db_id" value={movie.theMovieDbId} />
            <input type="hidden" name="category" value={category} />
            <button type="submit">리뷰 제출</button>
          </form>
          {renderError()}
          {reviewState.message && <p className={styles.message}>{reviewState.message}</p>}
        </div>
      ) : isReviewed ? (
        <p className={styles.rated}>이미 리뷰를 작성했습니다.</p>
      ) : (
        <p className={styles.loginPrompt}>
          <Link href="/login">로그인</Link>하고 리뷰를 작성해보세요!
        </p>
      )}
    </div>
  );
}
