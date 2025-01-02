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
  const [reviews, setReviews] = useState(movie.reviews || []);

  const isLogin = user !== null;
  const isReviewed = review_movieIds.includes(Number(movie.theMovieDbId));

  const handlePageChange = async (newPage: number) => {
    try {
      const response = await fetchMovieReviews(category, movie.id, newPage);
      setReviews(response.reviews);
    } catch (error) {
      console.error('리뷰 로딩 중 오류:', error);
    }
  };

  return (
    <div className={styles.reviewsTabContainer}>
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
