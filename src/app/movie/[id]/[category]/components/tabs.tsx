'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { rate } from '@/app/movie/lib/actions';
import styles from "./components.module.css";

export default function Tabs({ movie, user, category }: { movie: any, user: any, category: string }) {
  const initialState = {
    error: {},
    message: ""
  }
  const [state, formAction] = useActionState(rate, initialState)
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const isLogin = user.user ? true : false;
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
            <p>평점: {movie.voteAverage ? movie.voteAverage : 0}</p>
            {isLogin && (
              <div>
               <form action={formAction} className={styles.form}>
                <input type="number" min="0" max="5" name="rating" />
                <input type="hidden" name="user_id" value={user.user.id} />
                <input type="hidden" name="movie_id" value={movie.id} />
                <input type="hidden" name="category" value={category} />
                <button>평점 남기기</button>
               </form>
               
              </div>
            )}
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