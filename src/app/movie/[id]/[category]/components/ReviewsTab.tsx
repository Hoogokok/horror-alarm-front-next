import { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { review } from '@/app/movie/lib/actions';
import { REVIEWS_PER_PAGE } from '@/constants/pagination';
import styles from "./components.module.css";
import { UserWithMovieIds } from '@/types/user';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';

interface ReviewsTabProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

export default function ReviewsTab({ movie, userWithMovieIds, category }: ReviewsTabProps) {
  const initialState = {
    error: {},
    message: ""
  }
  const { user, review_movieIds } = userWithMovieIds;
  const isLogin = user !== null;
  const isReviewed = review_movieIds.includes(movie.theMovieDbId.toString());
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewState, reviewAction] = useActionState(review, initialState);

  const reviews = movie.reviews;
  const indexOfLastReview = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <div className={styles.review}>
      <ul>
        {currentReviews.map((review, index) => (
          <li key={index}>{review}</li>
        ))}
      </ul>
      
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastReview >= reviews.length}
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
          {reviewState?.error && <p>{reviewState.message}</p>}
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
