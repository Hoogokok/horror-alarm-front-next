'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { rate } from '@/app/movie/lib/actions';
import styles from "./components.module.css";
import Link from 'next/link';

export default function Tabs({ movie, user, movieIds, category }: { movie: any, user: any, movieIds: string[], category: string }) {
  const initialState = {
    error: {},
    message: ""
  }
  const [state, formAction] = useActionState(rate, initialState)
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const isLogin = user ? true : false;
  const [rating, setRating] = useState(0);
  const isRated = movieIds.includes(movie.id)

  const reviews = [
    "이 영화는 너무 재미있어요.",
    "이 영화는 너무 무섭습니다.",
    "이 영화는 너무 지루합니다.",
    "이 영화는 너무 감동적입니다.",
    "이 영화는 너무 재미없습니다.",
    "이 영화는 너무 재미있어요.",
    "이 영화는 너무 무섭습니다.",
    "이 영화는 너무 지루합니다.",
    "이 영화는 너무 감동적입니다.",
    "이 영화는 너무 재미없습니다.",
    "이 영화는 너무 재미있어요."
  ];

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div>{movie.overview}</div>;
      case 'reviews':
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
          </div>
        );
      case 'ratings':
        return (
          <div>
            <p>평점: {movie.voteAverage ? movie.voteAverage.toFixed(1) : 0}</p>
            {isLogin && !isRated && (
              <div>
                <form action={formAction} className={styles.ratingForm}>
                  <StarRating rating={rating} setRating={setRating} />
                  <input type="hidden" name="user_id" value={user.id} />
                  <input type="hidden" name="movie_id" value={movie.id} />
                  <input type="hidden" name="category" value={category} />
                  <button type="submit">평점 남기기</button>
                </form>
                {state.error && <p>{state.message}</p>}
              </div>
            )}
            {isRated && <p className={styles.rated}>이미 평점을 매겼습니다.</p>}
            {!isLogin && <Link href="/login" className={styles.rated}>로그인 후 이용해주세요.</Link>}
          </div>
        );
      case 'releaseDate':
        return <div>{movie.releaseDate}</div>;
      case 'watch':
        return <div>{movie.providers.join(', ')}</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('overview')}>줄거리</button>
        <button onClick={() => setActiveTab('reviews')}>리뷰</button>
        <button onClick={() => setActiveTab('ratings')}>평점</button>
        <button onClick={() => setActiveTab('releaseDate')}>개봉일</button>
        <button onClick={() => setActiveTab('watch')}>볼 수 있는 곳</button>
      </div>
      <div className={styles.tabContent}>
        {renderContent()}
      </div>
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
