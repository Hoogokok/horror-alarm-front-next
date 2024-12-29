'use client';

import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { UserWithMovieIds } from '@/types/user';
import localFont from 'next/font/local';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './styles/tabs.module.css';
import commonStyles from './styles/common.module.css';
import { TABS, DEFAULT_TABS, TAB_LABELS } from '@/constants/tabs';
import ErrorBoundary from './ErrorBoundary';

const doHyeon = localFont({
  src: '../../../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

interface PageTabsProps {
  movie: MovieDetailResponseDto;
  userWithMovieIds: UserWithMovieIds;
  category: string;
}

const RatingsTab = dynamic(
  () => import('./RatingsTab'),
  {
    loading: () => <div className={commonStyles.loading}>평점을 불러오는 중...</div>,
    ssr: false
  }
);

const ReviewsTab = dynamic(
  () => import('./ReviewsTab'),
  {
    loading: () => <div className={commonStyles.loading}>리뷰를 불러오는 중...</div>,
    ssr: false
  }
);

export default function PageTabs({ movie, userWithMovieIds, category }: PageTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab) return tab;
    return DEFAULT_TABS[category as keyof typeof DEFAULT_TABS] || DEFAULT_TABS.default;
  }, [searchParams, category]);

  const handleTabChange = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, searchParams, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number, buttons: typeof tabButtons) => {
    const tabCount = buttons.length;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + tabCount) % tabCount;
        handleTabChange(buttons[prevIndex].id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tabCount;
        handleTabChange(buttons[nextIndex].id);
        break;
      case 'Home':
        e.preventDefault();
        handleTabChange(buttons[0].id);
        break;
      case 'End':
        e.preventDefault();
        handleTabChange(buttons[tabCount - 1].id);
        break;
    }
  }, [handleTabChange]);

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

  const renderContent = useMemo(() => {
    const content = (tab: string) => {
      switch (tab) {
        case TABS.OVERVIEW:
          return (
            <ErrorBoundary componentName="줄거리">
              <div id="overview-content" role="tabpanel" aria-labelledby="overview-tab">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </div>
            </ErrorBoundary>
          );
        case TABS.REVIEWS:
          return (
            <ErrorBoundary componentName="리뷰">
              <div id="reviews-content" role="tabpanel" aria-labelledby="reviews-tab">
                <ReviewsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />
              </div>
            </ErrorBoundary>
          );
        case TABS.RATINGS:
          return (
            <ErrorBoundary componentName="평점">
              <div id="ratings-content" role="tabpanel" aria-labelledby="ratings-tab">
                <RatingsTab movie={movie} userWithMovieIds={userWithMovieIds} category={category} />
              </div>
            </ErrorBoundary>
          );
        case TABS.DATE:
          return (
            <ErrorBoundary componentName="날짜 정보">
              <div id="date-content" role="tabpanel" aria-labelledby="date-tab">
                {category === 'expiring' ? (
                  <p>스트리밍 종료일: {movie.expiringDate || '정보 없음'}</p>
                ) : (
                  <p>개봉일: {movie.releaseDate || '정보 없음'}</p>
                )}
              </div>
            </ErrorBoundary>
          );
        case TABS.WATCH:
          return (
            <ErrorBoundary componentName="시청 정보">
              <div id="watch-content" role="tabpanel" aria-labelledby="watch-tab">
                {movie.providers?.length ? movie.providers.join(', ') : '정보 없음'}
              </div>
            </ErrorBoundary>
          );
        default:
          return null;
      }
    };
    return content(activeTab);
  }, [activeTab, movie, userWithMovieIds, category]);

  if (!movie) {
    return <div className={commonStyles.error}>영화 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="영화 정보 탭">
        {tabButtons.map((tab, index) => (
          <button
            key={tab.id}
            id={`${tab.id}-tab`}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index, tabButtons)}
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-content`}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className={styles.tabContent}
        style={doHyeon.style}
        role="region"
        aria-live="polite"
      >
        {renderContent}
      </div>
    </div>
  );
}