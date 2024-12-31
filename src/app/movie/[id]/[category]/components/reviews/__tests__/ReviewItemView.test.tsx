import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewItemView } from '../components/ReviewItemView';
import { Review } from '@/types/movie-detail-response-dto';

describe('ReviewItemView', () => {
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
        poster_path: '/test.jpg',
        backdrop_path: '/test.jpg',
        release_date: '2024-01-01',
        genres: [{ id: 1, name: '액션' }],
        overview: '테스트 영화 줄거리',
        vote_average: 8.0,
        vote_count: 100
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
        movie: mockMovie,
        category: 'streaming',
        style: {}
    };

    it('작성자인 경우 수정/삭제 버튼이 표시됨', () => {
        render(<ReviewItemView {...defaultProps} isAuthor={true} />);

        expect(screen.getByRole('button', { name: '수정' })).toBeDefined();
        expect(screen.getByRole('button', { name: '삭제' })).toBeDefined();
    });

    it('작성자가 아닌 경우 수정/삭제 버튼이 표시되지 않음', () => {
        render(<ReviewItemView {...defaultProps} isAuthor={false} />);

        const editButton = screen.queryByRole('button', { name: '수정' });
        const deleteButton = screen.queryByRole('button', { name: '삭제' });
        expect(editButton).toBeNull();
        expect(deleteButton).toBeNull();
    });

    it('수정 모드에서는 폼과 hidden input들이 올바르게 렌더링되어야 함', () => {
        render(<ReviewItemView {...defaultProps} isAuthor={true} isEditing={true} />);

        expect(screen.getByRole('form')).toBeDefined();
        expect(screen.getByRole('textbox')).toBeDefined();

        // hidden inputs 확인
        const form = screen.getByRole('form');
        const formElement = form as HTMLFormElement;
        expect(formElement.elements.namedItem('reviewId')).toBeDefined();
        expect(formElement.elements.namedItem('userId')).toBeDefined();
        expect(formElement.elements.namedItem('movie_id')).toBeDefined();
        expect(formElement.elements.namedItem('category')).toBeDefined();
    });
}); 