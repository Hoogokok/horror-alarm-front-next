'use client';

import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MovieDetailResponseDto, Review } from '@/types/movie-detail-response-dto';
import { UserWithMovieIds } from '@/types/user';
import { review, ReviewState, updateReview, deleteReview } from '@/app/movie/lib/actions';
import { usePagination } from '@/hooks/usePagination';
import Link from 'next/link';
import { useActionState } from 'react';
import styles from './styles/reviews.module.css';
import commonStyles from './styles/common.module.css';
import { useRouter } from 'next/navigation';
import { fetchMovieReviews } from '@/utils/api';

interface ReviewsTabProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

interface ReviewItemProps {
  review: Review;
  currentUserId?: string;
  style: React.CSSProperties;
}

const ReviewItem = ({ review, currentUserId, style }: ReviewItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = currentUserId === review.profile?.id;
  const [updateState, updateAction] = useActionState(updateReview, { error: '', message: '' });
  const [deleteState, deleteAction] = useActionState(deleteReview, { error: '', message: '' });

  const renderActionError = (error: string | Record<string, string[]>) => {
    if (typeof error === 'string') {
      return <p className={styles.error}>{error}</p>;
    }
    return null;
  };

  return (
    <div className={styles.reviewItem} style={style}>
      <div className={styles.reviewContent}>
        <div className={styles.reviewHeader}>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>{review.profile?.name || '알 수 없음'}</div>
          </div>
          {isAuthor && (
            <div className={styles.reviewActions}>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                수정
              </button>
              <form action={deleteAction} style={{ display: 'inline' }}>
                <input type="hidden" name="reviewId" value={review.id} />
                <input type="hidden" name="userId" value={review.profile?.id} />
                <button 
                  type="submit" 
                  className={styles.deleteButton}
                  onClick={(e) => {
                    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                      e.preventDefault();
                    }
                  }}
                >
                  삭제
                </button>
              </form>
            </div>
          )}
        </div>
        {updateState.error && renderActionError(updateState.error)}
        {deleteState.error && renderActionError(deleteState.error)}
        {isEditing ? (
          <form action={updateAction} className={styles.editForm}>
            <input type="hidden" name="reviewId" value={review.id} />
            <input type="hidden" name="userId" value={review.profile?.id} />
            <textarea
              name="content"
              defaultValue={review.review_content}
              className={styles.reviewInput}
              required
            />
            <div className={styles.editActions}>
              <button type="submit" className={styles.saveButton}>
                저장
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
            <p className={styles.reviewText}>{review.review_content}</p>
        )}
      </div>
    </div>
  );
};

export default function ReviewsTab({ movie, userWithMovieIds, category }: ReviewsTabProps) {
  const initialState: ReviewState = {
    error: {},
    message: ""
  }
  const { user, review_movieIds } = userWithMovieIds;
  const isLogin = user !== null;
  const isReviewed = review_movieIds.includes(Number(movie.theMovieDbId));
  const [reviewState, reviewAction] = useActionState(review, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(movie.recentReviews || []);
  const parentRef = useRef<HTMLDivElement>(null);
  const hasReviews = movie.totalReviews > 0;

  const handlePageChange = async (newPage: number) => {
    try {
      const newReviews = await fetchMovieReviews(category, movie.id, newPage);
      setReviews(newReviews);
      setCurrentPage(newPage);
    } catch (error) {
      console.error('리뷰 로딩 중 오류:', error);
    }
  };

  const rowVirtualizer = useVirtualizer({
    count: reviews.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const renderError = () => {
    if (typeof reviewState.error === 'string') {
      return <p className={commonStyles.error}>{reviewState.error}</p>;
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

  const renderActionError = (error: string | Record<string, string[]>) => {
    if (typeof error === 'string') {
      return <p className={styles.error}>{error}</p>;
    }
    return null;
  };

  return (
    <div className={styles.review}>
      {isLogin && !isReviewed ? (
        <div className={styles.reviewForm}>
          <h3 className={styles.reviewTitle}>리뷰 작성하기</h3>
          <form action={reviewAction} role='form'>
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

      {hasReviews ? (
        <>
          <div ref={parentRef} className={styles.reviewList} style={{ height: '400px', overflow: 'auto' }}>
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
                  <ReviewItem
                    key={virtualRow.index}
                    review={review}
                    currentUserId={user?.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className={commonStyles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * 10 >= movie.totalReviews}
            >
              다음
            </button>
          </div>
        </>
      ) : (
          <div className={styles.noReviews}>
            <p>아직 작성된 리뷰가 없습니다.</p>
            {!isReviewed && isLogin && (
              <p>첫 번째 리뷰를 작성해보세요!</p>
            )}
          </div>
      )}
    </div>
  );
}
