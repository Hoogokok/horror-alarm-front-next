'use client';

import { useState } from 'react';
import styles from "./components.module.css";
import localFont from 'next/font/local';
import { UserWithMovieIds } from '@/types/user';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import ReviewsTab from './ReviewsTab';
import RatingsTab from './RatingsTab';

const doHyeon = localFont({
  src: '../../../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

interface PageTabsProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

export default function PageTabs({ movie, userWithMovieIds, category }: PageTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div>{movie.overview}</div>;
      case 'reviews':
        return <ReviewsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />;
      case 'ratings':
        return <RatingsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />;
      case 'date':
        return (
          <div>
            {category === 'expiring' ? (
              <p>스트리밍 종료일: {movie.expiringDate}</p>
            ) : (
              <p>개봉일: {movie.releaseDate}</p>
            )}
          </div>
        );
      case 'watch':
        return <div>{movie.providers ? movie.providers.join(', ') : '정보 없음'}</div>;
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
        <button onClick={() => setActiveTab('date')}>개봉일</button>
        <button onClick={() => setActiveTab('watch')}>볼 수 있는 곳</button>
      </div>
      <div className={styles.tabContent} style={doHyeon.style}>
        {renderContent()}
      </div>
    </div>
  );
}