export const RATING = {
    MIN: 1,
    MAX: 5,
    STEP: 1,
} as const;

export const RATING_MESSAGES = {
    ALREADY_RATED: '이미 평점을 매겼습니다.',
    LOGIN_REQUIRED: '로그인 후 이용해주세요.',
    SUBMIT_RATING: '평점 남기기',
    CURRENT_RATING: (rating: number) => `현재 선택된 평점: ${rating}점`,
    SELECT_RATING: '평점을 선택해주세요',
    RATING_LABEL: '영화 평점',
    STAR_LABEL: (star: number) => `${star}점`,
} as const;

export const FORM_LABELS = {
    RATING_TAB: '평점 탭',
    RATING_FORM: '평점 입력 폼',
    SUBMIT_BUTTON: '평점 제출하기',
    LOGIN_LINK: '로그인 페이지로 이동',
} as const; 