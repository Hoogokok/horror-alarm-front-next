'use client';

import { useState } from 'react';
import styles from "./components.module.css";

export default function Tabs({ movie }: { movie: any }) {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div>{movie.overview}</div>;
      case 'reviews':
        return (
          <div>
            <li> 이 영화는 너무 재미있어요. </li>
            <li> 이 영화는 너무 무섭습니다. </li>
            <li> 이 영화는 너무 지루합니다. </li>
            <li> 이 영화는 너무 감동적입니다. </li>
            <li> 이 영화는 너무 재미없습니다. </li>
            <li> 이영화는 너무 재미있어요. </li>
          </div>
        );
      case 'ratings':
        return (
          <div>
            <p>평균: 3.75/5</p>
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