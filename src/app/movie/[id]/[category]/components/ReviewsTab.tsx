'use client';

import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { UserWithMovieIds } from '@/types/user';
import { fetchMovieReviews } from '@/utils/api';
import { useRef, useState } from 'react';
import styles from './styles/reviews.module.css';
import ReviewList from './reviews/components/ReviewList';

interface ReviewsTabProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

export default function ReviewsTab({ movie, userWithMovieIds, category }: ReviewsTabProps) {
  const { user, review_movieIds } = userWithMovieIds;
  const isLogin = user !== null;

  const isReviewed = review_movieIds.includes(Number(movie.theMovieDbId));
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState(movie.recentReviews || []);
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

  return (
    <div className={styles.review}>
      {hasReviews ? (
        <ReviewList
          reviews={reviews}
          userName={user?.user_metadata?.name}
          currentUserId={user?.id}
          movie={movie}
          category={category}
          parentRef={parentRef}
          currentPage={currentPage}
          totalReviews={movie.totalReviews}
          onPageChange={handlePageChange}
          isLogin={isLogin}
          isReviewed={isReviewed}
          onReviewCreate={(newReview) => {
            setReviews(prev => [newReview, ...prev]);
          }}
        />
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
