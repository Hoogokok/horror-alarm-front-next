import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ReviewItem from '../components/ReviewItem';
import { Review } from '@/types/movie-detail-response-dto';
import { Profile } from '@/types/profile';
import { deleteReview, updateReview } from '@/app/movie/lib/actions';
import { useReviewActions } from '../hooks/useReviewActions';

// 상태 타입 정의
type ActionState = {
    error: string | Record<string, string[]>;
    message: string;
};

// 각 action에 대한 mock 상태를 별도로 관리
const mockStates = {
    deleteState: {
        error: '',
        message: ''
    } as ActionState,
    updateState: {
        error: '',
        message: ''
    } as ActionState
};

vi.mock('@/app/movie/lib/actions', () => ({
    deleteReview: vi.fn(),
    updateReview: vi.fn(),
    useActionState: vi.fn().mockImplementation((action) => {
        // action에 따라 적절한 상태와 dispatch 반환
        if (action === deleteReview) {
            const dispatch = vi.fn().mockImplementation(async (formData: FormData) => {
                // 삭제 작업 결과를 mockStates에 반영
                mockStates.deleteState = {
                    error: '',
                    message: '리뷰가 삭제되었습니다.'
                };
                return mockStates.deleteState;
            });
            return [mockStates.deleteState, dispatch];
        }

        if (action === updateReview) {
            const dispatch = vi.fn().mockImplementation(async (formData: FormData) => {
                // 수정 작업 결과를 mockStates에 반영
                mockStates.updateState = {
                    error: '',
                    message: '리뷰가 수정되었습니다.'
                };
                return mockStates.updateState;
            });
            return [mockStates.updateState, dispatch];
        }

        // 기본 상태 반환
        return [{ error: '', message: '' }, vi.fn()];
    })
}));

vi.mock('../hooks/useReviewActions', () => ({
    useReviewActions: vi.fn().mockImplementation(() => ({
        deleteState: { error: '', message: '' },
        updateState: { error: '', message: '수정 성공' },
        reviewState: { error: '', message: '' },
        deleteAction: vi.fn(),
        updateAction: vi.fn(),
        reviewAction: vi.fn()
    }))
}));

const mockReview: Review = {
    id: '1',
    content: '테스트 리뷰 내용입니다.',
    review_user_id: 'user1',
    review_movie_id: '12345',
    created_at: new Date().toISOString(),
    profile: {
        id: 'user1',
        name: '테스트 유저',
    } as Profile,
};

const mockMovie = {
    id: 'movie1',
    theMovieDbId: '12345',
    title: '테스트 영화',
    posterPath: '/test.jpg',
    overview: '테스트 설명',
    releaseDate: '2024-01-01',
    runtime: 120,
    voteAverage: 7.5,
    voteCount: 100,
    recentReviews: [],
    totalReviews: 0,
};

describe('ReviewItem 컴포넌트', () => {
    const mockOnRefresh = vi.fn();
    const mockOnEditStart = vi.fn();
    const mockOnEditEnd = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('리뷰 내용과 작성자 이름이 올바르게 표시되어야 함', () => {
        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user2"
                style={{}}
                movie={mockMovie}
                category="streaming"
                onRefresh={mockOnRefresh}
                isEditing={false}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText('테스트 리뷰 내용입니다.')).toBeDefined();
        expect(screen.getByText('테스트 유저')).toBeDefined();
    });

    it('작성자가 아닌 경우 수정/삭제 버튼이 보이지 않아야 함', () => {
        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user2"
                style={{}}
                movie={mockMovie}
                category="streaming"
                onRefresh={mockOnRefresh}
                isEditing={false}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        const editButton = screen.queryByRole('button', { name: '수정' });
        const deleteButton = screen.queryByRole('button', { name: '삭제' });
        expect(editButton).toBeNull();
        expect(deleteButton).toBeNull();
    });

    it('작성자인 경우 수정/삭제 버튼이 보여야 함', () => {
        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user1"
                style={{}}
                movie={mockMovie}
                category="streaming"
                onRefresh={mockOnRefresh}
                isEditing={false}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByRole('button', { name: '수정' })).toBeDefined();
        expect(screen.getByRole('button', { name: '삭제' })).toBeDefined();
    });

    it('수정 모드에서는 텍스트 영역과 저장/취소 버튼이 표시되어야 함', () => {
        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user1"
                style={{}}
                movie={mockMovie}
                category="streaming"
                onRefresh={mockOnRefresh}
                isEditing={true}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea).toBeDefined();
        expect(textarea.value).toBe('테스트 리뷰 내용입니다.');
        expect(screen.getByRole('button', { name: '저장' })).toBeDefined();
        expect(screen.getByRole('button', { name: '취소' })).toBeDefined();
    });

    it('삭제 버튼 클릭 시 확인 대화상자가 표시되어야 함', () => {
        window.confirm = vi.fn(() => true);

        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user1"
                style={{}}
                movie={mockMovie}
                category="streaming"
                onRefresh={mockOnRefresh}
                isEditing={false}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        const deleteButton = screen.getByRole('button', { name: '삭제' });
        fireEvent.click(deleteButton);

        expect(window.confirm).toHaveBeenCalledWith('정말로 이 리뷰를 삭제하시겠습니까?');
    });

    it('수정 버튼 클릭 시 수정 모드로 전환되어야 함', () => {
        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user1"
                style={{}}
                movie={mockMovie}
                category="streaming"
                onRefresh={mockOnRefresh}
                isEditing={false}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        const editButton = screen.getByRole('button', { name: '수정' });
        fireEvent.click(editButton);

        expect(mockOnEditStart).toHaveBeenCalled();
    });

    it('수정 성공 시 onUpdate가 호출되어야 함', async () => {
        const mockUpdateAction = vi.fn();
        (useReviewActions as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
            updateState: { error: '', message: '수정 성공' },
            updateAction: mockUpdateAction,
            deleteState: { error: '', message: '' },
            deleteAction: vi.fn(),
            reviewState: { error: '', message: '' },
            reviewAction: vi.fn()
        }));

        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user1"
                style={{}}
                movie={mockMovie}
                category="streaming"
                onRefresh={mockOnRefresh}
                isEditing={true}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onUpdate={mockOnUpdate}
                onDelete={mockOnDelete}
            />
        );

        const form = screen.getByRole('form');
        await fireEvent.submit(form);

        expect(mockUpdateAction).toHaveBeenCalled();
        expect(mockOnUpdate).toHaveBeenCalled();
    });
});