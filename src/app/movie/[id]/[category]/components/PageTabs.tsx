'use client';

import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { UserWithMovieIds } from '@/types/user';
import localFont from 'next/font/local';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import styles from "./components.module.css";
import RatingsTab from './RatingsTab';
import ReviewsTab from './ReviewsTab';
import { TABS, DEFAULT_TABS, TAB_LABELS } from '@/constants/tabs';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab) return tab;
    return DEFAULT_TABS[category as keyof typeof DEFAULT_TABS] || DEFAULT_TABS.default;
  }, [searchParams, category]);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return <div id="overview-content" role="tabpanel" aria-labelledby="overview-tab">{movie.overview}</div>;
      case TABS.REVIEWS:
        return <div id="reviews-content" role="tabpanel" aria-labelledby="reviews-tab">
          <ReviewsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />
        </div>;
      case TABS.RATINGS:
        return <div id="ratings-content" role="tabpanel" aria-labelledby="ratings-tab">
          <RatingsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />
        </div>;
      case TABS.DATE:
        return (
          <div id="date-content" role="tabpanel" aria-labelledby="date-tab">
            {category === 'expiring' ? (
              <p>스트리밍 종료일: {movie.expiringDate}</p>
            ) : (
              <p>개봉일: {movie.releaseDate}</p>
            )}
          </div>
        );
      case TABS.WATCH:
        return <div id="watch-content" role="tabpanel" aria-labelledby="watch-tab">
          {movie.providers ? movie.providers.join(', ') : '정보 없음'}
        </div>;
      default:
        return null;
    }
  }, [activeTab, movie, userWithMovieIds, category]);

  const tabButtons = useMemo(() => [
    { id: TABS.OVERVIEW, label: TAB_LABELS[TABS.OVERVIEW] },
    { id: TABS.REVIEWS, label: TAB_LABELS[TABS.REVIEWS] },
    { id: TABS.RATINGS, label: TAB_LABELS[TABS.RATINGS] },
    {
      id: TABS.DATE,
      label: category === 'expiring' ? '스트리밍 종료일' : TAB_LABELS[TABS.DATE]
    },
    { id: TABS.WATCH, label: TAB_LABELS[TABS.WATCH] },
  ], [category]);

  return (
    <div>
      <div className={styles.tabs} role="tablist">
        {tabButtons.map((tab) => (
          <button
            key={tab.id}
            id={`${tab.id}-tab`}
            onClick={() => handleTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
            aria-controls={`${tab.id}-content`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent} style={doHyeon.style}>
        {renderContent}
      </div>
    </div>
  );
}