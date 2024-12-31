import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ReviewItemContainer } from '../containers/ReviewItemContainer';
import { useReviewActions } from '../hooks/useReviewActions';

// useReviewActions mock
vi.mock('../hooks/useReviewActions', () => ({
    useReviewActions: vi.fn()
}));

describe('ReviewItemContainer', () => {
    const mockReview = {
        id: '1',
        content: '테스트 리뷰 내용입니다.',
        review_user_id: 'user1',
        review_movie_id: 'movie1',
        created_at: new Date().toISOString(),
        profile: {
            id: 'user1',
            name: '테스트 유저'
        }
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

    const mockActions = {
        deleteState: { error: null },
        deleteAction: vi.fn(),
        updateState: { error: null },
        updateAction: vi.fn(),
    };

    const defaultProps = {
        review: mockReview,
        currentUserId: 'user1',
        style: {},
        movie: mockMovie,
        category: 'streaming',
        onRefresh: vi.fn(),
        isEditing: false,
        onEditStart: vi.fn(),
        onEditEnd: vi.fn(),
        onUpdate: vi.fn(),
        onDelete: vi.fn(),
    };

    beforeEach(() => {
        (useReviewActions as any).mockReturnValue(mockActions);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('리뷰 수정 시 updateAction이 호출되어야 함', async () => {
        render(<ReviewItemContainer {...defaultProps} isEditing={true} />);

        const form = screen.getByRole('form');
        await fireEvent.submit(form);

        expect(mockActions.updateAction).toHaveBeenCalled();
        const formData = mockActions.updateAction.mock.calls[0][0];
        expect(formData.get('movie_id')).toBe(mockMovie.id);
        expect(formData.get('category')).toBe('streaming');
    });

    it('리뷰 수정 성공 시 onUpdate와 onEditEnd가 호출되어야 함', async () => {
        render(<ReviewItemContainer {...defaultProps} isEditing={true} />);

        const form = screen.getByRole('form');
        await fireEvent.submit(form);

        expect(defaultProps.onUpdate).toHaveBeenCalled();
        expect(defaultProps.onEditEnd).toHaveBeenCalled();
    });

    it('리뷰 삭제 시 확인 후 deleteAction이 호출되어야 함', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        render(<ReviewItemContainer {...defaultProps} />);

        const deleteButton = screen.getByRole('button', { name: '삭제' });
        await fireEvent.click(deleteButton);

        expect(mockActions.deleteAction).toHaveBeenCalled();
        const formData = mockActions.deleteAction.mock.calls[0][0];
        expect(formData.get('reviewId')).toBe(mockReview.id);
        expect(formData.get('userId')).toBe(mockReview.profile.id);
    });

    it('리뷰 삭제 성공 시 onDelete가 호출되어야 함', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        render(<ReviewItemContainer {...defaultProps} />);

        const deleteButton = screen.getByRole('button', { name: '삭제' });
        await fireEvent.click(deleteButton);

        expect(defaultProps.onDelete).toHaveBeenCalledWith(mockReview.id);
    });

    it('삭제 취소 시 deleteAction이 호출되지 않아야 함', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        render(<ReviewItemContainer {...defaultProps} />);

        const deleteButton = screen.getByRole('button', { name: '삭제' });
        await fireEvent.click(deleteButton);

        expect(mockActions.deleteAction).not.toHaveBeenCalled();
        expect(defaultProps.onDelete).not.toHaveBeenCalled();
    });
}); 