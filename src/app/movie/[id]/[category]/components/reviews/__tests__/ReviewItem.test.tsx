import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewItem from '../components/ReviewItem';
import { Review } from '@/types/movie-detail-response-dto';
import { Profile } from '@/types/profile';
import { ErrorType } from '@/types/error';

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
    const mockOnEditContentChange = vi.fn();
    const mockOnEditStart = vi.fn();
    const mockOnEditEnd = vi.fn();
    const mockOnSubmit = vi.fn();
    const mockOnDelete = vi.fn();

    const defaultProps = {
        review: mockReview,
        currentUserId: 'user1',
        style: {},
        movie: mockMovie,
        category: 'streaming',
        isEditing: false,
        editContent: mockReview.content,
        onEditContentChange: mockOnEditContentChange,
        onEditStart: mockOnEditStart,
        onEditEnd: mockOnEditEnd,
        onSubmit: mockOnSubmit,
        onDelete: mockOnDelete
    };

    it('리뷰 내용과 작성자 이름이 올바르게 표시되어야 함', () => {
        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user2"
                style={{}}
                movie={mockMovie}
                category="streaming"
                isEditing={false}
                editContent={mockReview.content}
                onEditContentChange={mockOnEditContentChange}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onSubmit={mockOnSubmit}
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
                isEditing={false}
                editContent={mockReview.content}
                onEditContentChange={mockOnEditContentChange}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onSubmit={mockOnSubmit}
                onDelete={mockOnDelete}
            />
        );

        const editButton = screen.queryByRole('button', { name: '수정' });
        const deleteButton = screen.queryByRole('button', { name: '삭제' });
        expect(editButton).toBeNull();
        expect(deleteButton).toBeNull();
    });

    it('수정 모드에서는 텍스트 영역과 저장/취소 버튼이 표시되어야 함', () => {
        render(
            <ReviewItem
                review={mockReview}
                currentUserId="user1"
                style={{}}
                movie={mockMovie}
                category="streaming"
                isEditing={true}
                editContent={mockReview.content}
                onEditContentChange={mockOnEditContentChange}
                onEditStart={mockOnEditStart}
                onEditEnd={mockOnEditEnd}
                onSubmit={mockOnSubmit}
                onDelete={mockOnDelete}
            />
        );

        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea).toBeDefined();
        expect(textarea.value).toBe('테스트 리뷰 내용입니다.');
        expect(screen.getByRole('button', { name: '저장' })).toBeDefined();
        expect(screen.getByRole('button', { name: '취소' })).toBeDefined();
    });

    it('에러가 있을 경우 에러 메시지를 표시해야 함', () => {
        const error: ErrorType = "테스트 에러 메시지";
        render(
            <ReviewItem
                {...defaultProps}
                error={error}
            />
        );
        expect(screen.getByText('테스트 에러 메시지')).toBeDefined();
    });
});