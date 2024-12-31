'use client';

import { useState } from 'react';
import { Review, MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { useReviewActions } from './hooks/useReviewActions';
import { ReviewItemView } from './ReviewItemView';

interface ReviewItemProps {
    review: Review;
    currentUserId?: string;
    style: React.CSSProperties;
    movie: MovieDetailResponseDto;
    category: string;
    onRefresh?: () => void;
    isEditing: boolean;
    onEditStart: () => void;
    onEditEnd: () => void;
    onUpdate: (updatedReview: Review) => void;
    onDelete: (deletedReviewId: string) => void;
}

export default function ReviewItem({
    review,
    currentUserId,
    style,
    onRefresh,
    isEditing,
    onEditStart,
    onEditEnd,
    movie,
    category,
    onUpdate,
    onDelete
}: ReviewItemProps) {
    const isAuthor = currentUserId === review.profile?.id;
    const { deleteState, deleteAction, updateState, updateAction } = useReviewActions();
    const [editContent, setEditContent] = useState(review.content);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        formData.append('movie_id', movie.id);
        formData.append('category', category);

        await updateAction(formData);
        if (!updateState.error) {
            onUpdate({ ...review, content: formData.get('content') as string });
            onEditEnd();
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        const formData = new FormData();
        formData.append('reviewId', review.id);
        formData.append('userId', review.profile?.id || '');
        formData.append('movie_id', movie.id);
        formData.append('category', category);

        await deleteAction(formData);
        if (!deleteState.error) {
            onDelete(review.id);
        }
    };

    const error = deleteState.error || updateState.error;

    return (
        <ReviewItemView
            review={review}
            isAuthor={isAuthor}
            isEditing={isEditing}
            editContent={editContent}
            onEditContentChange={setEditContent}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
            onEditSubmit={handleSubmit}
            onDeleteClick={handleDelete}
            error={typeof error === 'string' ? error : undefined}
            style={style}
            movie={movie}
            category={category}
        />
    );
} 