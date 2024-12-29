'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
  const parentRef = useRef<HTMLDivElement>(null);
  const reviews = movie.reviews || [];

  const rowVirtualizer = useVirtualizer({
    count: reviews.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // 각 리뷰 아이템의 예상 높이
    overscan: 5, // 추가로 렌더링할 아이템 수
  });

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
      <div
        ref={parentRef}
        className={styles.reviewList}
        style={{
          height: '400px', // 고정 높이 설정
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const review = reviews[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                className={styles.reviewItem}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className={styles.review}>
                  <p>{review.content}</p>
                  <small>작성자: {review.profiles?.name || '알 수 없음'}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
