import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ReviewItemView } from '../components/ReviewItemView';
import { Review } from '@/types/movie-detail-response-dto';

describe('ReviewItemView', () => {
    afterEach(() => {
        cleanup();
    });

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
    } as Review;

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

    const defaultProps = {
        review: mockReview,
        isAuthor: false,
        isEditing: false,
        editContent: mockReview.content,
        onEditContentChange: vi.fn(),
        onEditStart: vi.fn(),
        onEditEnd: vi.fn(),
        onEditSubmit: vi.fn(),
        onDeleteClick: vi.fn(),
        error: undefined,
        style: {},
        movie: mockMovie,
        category: 'streaming'
    };

    it('리뷰 내용과 작성자 이름이 올바르게 표시되어야 함', () => {
        render(<ReviewItemView {...defaultProps} />);

        expect(screen.getByText('테스트 리뷰 내용입니다.')).toBeDefined();
        expect(screen.getByText('테스트 유저')).toBeDefined();
    });

    it('작성자가 아닌 경우 수정/삭제 버튼이 보이지 않아야 함', () => {
        render(<ReviewItemView {...defaultProps} isAuthor={false} />);

        const editButton = screen.queryByRole('button', { name: '수정' });
        const deleteButton = screen.queryByRole('button', { name: '삭제' });
        expect(editButton).toBeNull();
        expect(deleteButton).toBeNull();
    });

    it('작성자인 경우 수정/삭제 버튼이 보여야 함', () => {
        render(<ReviewItemView {...defaultProps} isAuthor={true} />);

        expect(screen.getByRole('button', { name: '수정' })).toBeDefined();
        expect(screen.getByRole('button', { name: '삭제' })).toBeDefined();
    });

    it('수정 모드에서는 폼과 hidden input들이 올바르게 렌더링되어야 함', () => {
        render(<ReviewItemView {...defaultProps} isAuthor={true} isEditing={true} />);

        const form = screen.getByRole('form');
        expect(form).toBeDefined();

        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.value).toBe('테스트 리뷰 내용입니다.');

        // hidden inputs 확인
        const formElement = form as HTMLFormElement;
        expect(formElement.elements.namedItem('reviewId')).toBeDefined();
        expect(formElement.elements.namedItem('userId')).toBeDefined();
        expect(formElement.elements.namedItem('movie_id')).toBeDefined();
        expect(formElement.elements.namedItem('category')).toBeDefined();
    });

    it('수정 모드에서 텍스트 변경 시 onEditContentChange가 호출되어야 함', () => {
        const onEditContentChange = vi.fn();
        render(<ReviewItemView {...defaultProps} isEditing={true} onEditContentChange={onEditContentChange} />);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: '수정된 내용' } });

        expect(onEditContentChange).toHaveBeenCalledWith('수정된 내용');
    });

    it('폼 제출 시 onEditSubmit이 호출되어야 함', () => {
        const onEditSubmit = vi.fn();
        render(<ReviewItemView {...defaultProps} isEditing={true} onEditSubmit={onEditSubmit} />);

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        expect(onEditSubmit).toHaveBeenCalled();
    });

    it('에러가 있을 경우 에러 메시지를 표시해야 함', () => {
        render(<ReviewItemView {...defaultProps} error="테스트 에러 메시지" />);
        expect(screen.getByText('테스트 에러 메시지')).toBeDefined();
    });
}); 