import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ReviewListContainer } from '../containers/ReviewListContainer';
import { Review } from '@/types/movie-detail-response-dto';

// Supabase client 모킹
vi.mock('@/utils/supabase/server', () => ({
    createClient: vi.fn(() => ({}))
}));

// useReviewActions 훅 모킹
vi.mock('../hooks/useReviewActions', () => ({
    useReviewActions: () => ({
        handleReviewCreate: vi.fn(),
        handleReviewUpdate: vi.fn(),
        handleReviewDelete: vi.fn(),
        isLoading: false,
        error: null
    })
}));

// ReviewList 컴포넌트 모킹
const mockHandleReviewCreate = vi.fn();
const mockHandlePageChange = vi.fn();
const mockHandleReviewDelete = vi.fn();
const mockHandleReviewUpdate = vi.fn();

vi.mock('../components/ReviewList', () => ({
    default: ({ reviews, onPageChange, onReviewCreate, onReviewDelete, onReviewUpdate }: {
        reviews: Review[],
        onPageChange: (page: number) => void,
        onReviewCreate: (review: Review) => void,
        onReviewDelete: (id: string) => void,
        onReviewUpdate: (review: Review) => void
    }) => {
        mockHandleReviewCreate.mockImplementation(onReviewCreate);
        mockHandlePageChange.mockImplementation(onPageChange);
        mockHandleReviewDelete.mockImplementation(onReviewDelete);
        mockHandleReviewUpdate.mockImplementation(onReviewUpdate);

        return (
            <div data-testid="review-list">
                {reviews.length === 0 ? (
                    <div>아직 작성된 리뷰가 없습니다.</div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} data-testid="review-item">
                            <div>{review.content}</div>
                            <div>{review.profile?.name}</div>
                        </div>
                    ))
                )}
                <button onClick={() => onPageChange(2)}>다음</button>
            </div>
        );
    }
}));

describe('ReviewListContainer', () => {
    const mockMovie = {
        id: '1',
        title: '테스트 영화',
        totalReviews: 1,
        posterPath: '/test.jpg',
        overview: '테스트 설명',
        releaseDate: '2024-01-01',
        runtime: 120,
        voteAverage: 8.5,
        voteCount: 100,
        theMovieDbId: 'tmdb1',
        genres: [{ id: 1, name: '액션' }],
        reviews: []
    };

    const mockReviews: Review[] = [{
        id: '1',
        content: '테스트 리뷰입니다.',
        review_user_id: 'user1',
        review_movie_id: '1',
        created_at: new Date().toISOString(),
        profile: {
            id: 'user1',
            name: '테스트 유저'
        }
    }];

    const mockProps = {
        initialReviews: mockReviews,
        movie: mockMovie,
        category: 'all',
        currentUserId: 'user1',
        isLogin: true,
        isReviewed: false,
        userName: '테스트 유저',
        onPageChange: vi.fn()
    };

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('초기 리뷰 목록을 올바르게 렌더링한다', () => {
        render(<ReviewListContainer {...mockProps} />);
        expect(screen.getByText('테스트 리뷰입니다.')).toBeDefined();
    });

    it('페이지 변경 시 onPageChange 콜백이 호출된다', () => {
        render(<ReviewListContainer {...mockProps} />);
        fireEvent.click(screen.getByText('다음'));
        expect(mockProps.onPageChange).toHaveBeenCalledWith(2);
    });

    it('새 리뷰가 생성되면 리뷰 목록이 업데이트된다', () => {
        render(<ReviewListContainer {...mockProps} />);

        // 초기 상태 확인
        expect(screen.getByText('테스트 리뷰입니다.')).toBeDefined();

        const newReview: Review = {
            id: '2',
            content: '새로운 리뷰입니다.',
            review_user_id: 'user1',
            review_movie_id: '1',
            created_at: new Date().toISOString(),
            profile: {
                id: 'user1',
                name: '테스트 유저'
            }
        };

        act(() => {
            mockHandleReviewCreate(newReview);
        });

        // 새로운 리뷰가 목록에 추가되었는지 확인
        expect(screen.getByText('새로운 리뷰입니다.')).toBeDefined();
        expect(screen.getAllByTestId('review-item')).toHaveLength(2);
    });

    it('리뷰가 삭제되면 리뷰 목록에서 제거된다', () => {
        render(<ReviewListContainer {...mockProps} />);

        // 초기 상태 확인
        expect(screen.getByText('테스트 리뷰입니다.')).toBeDefined();
        expect(screen.getAllByTestId('review-item')).toHaveLength(1);

        act(() => {
            mockHandleReviewDelete(mockReviews[0].id);
        });

        // 리뷰가 삭제되었는지 확인
        expect(screen.queryByText('테스트 리뷰입니다.')).toBeNull();
        expect(screen.queryAllByTestId('review-item')).toHaveLength(0);
    });

    it('리뷰가 수정되면 리뷰 목록이 업데이트된다', () => {
        render(<ReviewListContainer {...mockProps} />);

        const updatedReview = {
            ...mockReviews[0],
            content: '수정된 리뷰입니다.'
        };

        act(() => {
            mockHandleReviewUpdate(updatedReview);
        });

        expect(screen.getByText('수정된 리뷰입니다.')).toBeDefined();
    });

    it('비로그인 상태에서는 리뷰 작성 폼이 표시되지 않는다', () => {
        const nonLoginProps = {
            ...mockProps,
            isLogin: false,
            currentUserId: ""
        };

        render(<ReviewListContainer {...nonLoginProps} />);

        // 리뷰 목록은 표시됨
        expect(screen.getByText('테스트 리뷰입니다.')).toBeDefined();

        // 리뷰 작성 폼은 표시되지 않음
        expect(screen.queryByRole('form')).toBeNull();
    });

    it('이미 리뷰를 작성한 경우 리뷰 작성 폼이 표시되지 않는다', () => {
        const reviewedProps = {
            ...mockProps,
            isReviewed: true
        };

        render(<ReviewListContainer {...reviewedProps} />);

        // 리뷰 목록은 표시됨
        expect(screen.getByText('테스트 리뷰입니다.')).toBeDefined();

        // 리뷰 작성 폼은 표시되지 않음
        expect(screen.queryByRole('form')).toBeNull();
    });

    it('리뷰가 없을 때 빈 상태 메시지가 표시된다', () => {
        const emptyProps = {
            ...mockProps,
            initialReviews: []
        };

        render(<ReviewListContainer {...emptyProps} />);
        expect(screen.getByText('아직 작성된 리뷰가 없습니다.')).toBeDefined();
    });

    it('리뷰 내용이 매우 긴 경우에도 올바르게 표시된다', () => {
        const longReviewProps = {
            ...mockProps,
            initialReviews: [{
                ...mockReviews[0],
                content: 'a'.repeat(1000)  // 1000자 리뷰
            }]
        };

        render(<ReviewListContainer {...longReviewProps} />);
        expect(screen.getByText('a'.repeat(1000))).toBeDefined();
    });
});

