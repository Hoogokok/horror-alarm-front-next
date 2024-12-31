'use client';

import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { UserWithMovieIds } from '@/types/user';
import { fetchMovieReviews } from '@/utils/api';
import { useState } from 'react';
import styles from '../components/reviews/styles/reviews.module.css';
import { ReviewListContainer } from '../components/reviews/containers/ReviewListContainer';

interface ReviewsTabProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

export default function ReviewsTab({ movie, userWithMovieIds, category }: ReviewsTabProps) {
  const { user, review_movieIds } = userWithMovieIds;
  const [reviews, setReviews] = useState(movie.recentReviews || []);
  const isLogin = user !== null;
  const isReviewed = review_movieIds.includes(Number(movie.theMovieDbId));
  const hasReviews = movie.totalReviews > 0;

  const handlePageChange = async (newPage: number) => {
    try {
      const newReviews = await fetchMovieReviews(category, movie.id, newPage);
      setReviews(newReviews);
      } catch (error) {
        console.error('리뷰 로딩 중 오류:', error);
      }
    };

  if (!hasReviews) {
      return (
        <div className={styles.review}>
            <div className={styles.noReviews}>
              <p>아직 작성된 리뷰가 없습니다.</p>
              {!isReviewed && isLogin && (
                <p>첫 번째 리뷰를 작성해보세요!</p>
              )}
            </div>
      </div>
    );
  }

  return (
    <div className={styles.review}>
      <ReviewListContainer
        initialReviews={reviews}
        movie={movie}
        category={category}
        currentUserId={user?.id}
        isLogin={isLogin}
        isReviewed={isReviewed}
        userName={user?.user_metadata?.name}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
