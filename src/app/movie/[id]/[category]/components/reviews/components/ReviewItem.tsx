'use client';

import { Review, MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { ReviewItemView } from './ReviewItemView';

interface ReviewItemProps {
    review: Review;
    currentUserId?: string;
    style: React.CSSProperties;
    movie: MovieDetailResponseDto;
    category: string;
    isEditing: boolean;
    editContent: string;
    onEditContentChange: (content: string) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    error?: string;
}

export default function ReviewItem({
    review,
    currentUserId,
    style,
    movie,
    category,
    isEditing,
    editContent,
    onEditContentChange,
    onEditStart,
    onEditEnd,
    onSubmit,
    onDelete,
    error
}: ReviewItemProps) {
    const isAuthor = currentUserId === review.profile?.id;

    return (
        <ReviewItemView
            review={review}
            isAuthor={isAuthor}
            isEditing={isEditing}
            editContent={editContent}
            onEditContentChange={onEditContentChange}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
            onEditSubmit={onSubmit}
            onDeleteClick={onDelete}
            error={error}
            style={style}
            movie={movie}
            category={category}
        />
    );
} 