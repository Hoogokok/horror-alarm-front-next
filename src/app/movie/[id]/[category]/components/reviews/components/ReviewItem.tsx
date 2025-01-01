'use client';

import { ReviewItemProps } from '../types/review-props';
import { ReviewItemView } from './ReviewItemView';

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