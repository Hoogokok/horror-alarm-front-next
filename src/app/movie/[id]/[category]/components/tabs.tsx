'use client';

import { useState, useCallback } from 'react';
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

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div id="overview-content" role="tabpanel" aria-labelledby="overview-tab">{movie.overview}</div>;
      case 'reviews':
        return <div id="reviews-content" role="tabpanel" aria-labelledby="reviews-tab">
          <ReviewsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />
        </div>;
      case 'ratings':
        return <div id="ratings-content" role="tabpanel" aria-labelledby="ratings-tab">
          <RatingsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />
        </div>;
      case 'date':
        return (
          <div id="date-content" role="tabpanel" aria-labelledby="date-tab">
            {category === 'expiring' ? (
              <p>스트리밍 종료일: {movie.expiringDate}</p>
            ) : (
              <p>개봉일: {movie.releaseDate}</p>
            )}
          </div>
        );
      case 'watch':
        return <div id="watch-content" role="tabpanel" aria-labelledby="watch-tab">
          {movie.providers ? movie.providers.join(', ') : '정보 없음'}
        </div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className={styles.tabs} role="tablist">
        <button 
          id="overview-tab"
          onClick={() => handleTabChange('overview')} 
          aria-selected={activeTab === 'overview'} 
          role="tab" 
          aria-controls="overview-content"
        >
          줄거리
        </button>
        <button 
          id="reviews-tab"
          onClick={() => handleTabChange('reviews')} 
          aria-selected={activeTab === 'reviews'} 
          role="tab" 
          aria-controls="reviews-content"
        >
          리뷰
        </button>
        <button 
          id="ratings-tab"
          onClick={() => handleTabChange('ratings')} 
          aria-selected={activeTab === 'ratings'} 
          role="tab" 
          aria-controls="ratings-content"
        >
          평점
        </button>
        <button 
          id="date-tab"
          onClick={() => handleTabChange('date')} 
          aria-selected={activeTab === 'date'} 
          role="tab" 
          aria-controls="date-content"
        >
          {category === 'expiring' ? '스트리밍 종료일' : '개봉일'}
        </button>
        <button 
          id="watch-tab"
          onClick={() => handleTabChange('watch')} 
          aria-selected={activeTab === 'watch'} 
          role="tab" 
          aria-controls="watch-content"
        >
          볼 수 있는 곳
        </button>
      </div>
      <div className={styles.tabContent} style={doHyeon.style}>
        {renderContent()}
      </div>
    </div>
  );
}