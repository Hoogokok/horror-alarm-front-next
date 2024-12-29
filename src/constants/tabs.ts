export const TABS = {
    OVERVIEW: 'overview',
    REVIEWS: 'reviews',
    RATINGS: 'ratings',
    DATE: 'date',
    WATCH: 'watch',
} as const;

export const DEFAULT_TABS = {
    reviews: TABS.REVIEWS,
    ratings: TABS.RATINGS,
    expiring: TABS.DATE,
    default: TABS.OVERVIEW,
} as const;

export const TAB_LABELS = {
    [TABS.OVERVIEW]: '줄거리',
    [TABS.REVIEWS]: '리뷰',
    [TABS.RATINGS]: '평점',
    [TABS.DATE]: '날짜',
    [TABS.WATCH]: '볼 수 있는 곳',
} as const; 