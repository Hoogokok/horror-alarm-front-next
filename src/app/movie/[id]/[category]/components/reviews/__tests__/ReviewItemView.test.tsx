import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewItemView } from '../ReviewItemView';
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
    };

    it('작성자인 경우 수정/삭제 버튼이 표시됨', () => {
        render(<ReviewItemView {...defaultProps} isAuthor={true} />);

        expect(screen.getByRole('button', { name: '수정' })).toBeDefined();
        expect(screen.getByRole('button', { name: '삭제' })).toBeDefined();
    });

    it('작성자가 아닌 경우 수정/삭제 버튼이 표시되지 않음', () => {
        const props = {
            ...defaultProps,
            isAuthor: false,
            style: {}
        };
        render(<ReviewItemView {...props} />);

        const editButton = screen.queryByRole('button', { name: '수정' });
        const deleteButton = screen.queryByRole('button', { name: '삭제' });

        expect(editButton).toBeNull();
        expect(deleteButton).toBeNull();
    });

    // ... 더 많은 테스트 케이스
}); 