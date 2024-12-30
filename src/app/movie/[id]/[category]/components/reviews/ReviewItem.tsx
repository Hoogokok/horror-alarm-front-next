'use client';

import { deleteReview, updateReview } from '@/app/movie/lib/actions';
import { Review, MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { useActionState } from 'react';
import { useState } from 'react';
import styles from '../styles/reviews.module.css';

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
}

export default function ReviewItem({
    review,
    currentUserId,
    style,
    movie,
    category,
    onRefresh,
    isEditing,
    onEditStart,
    onEditEnd
}: ReviewItemProps) {
    const isAuthor = currentUserId === review.profile?.id;
    const [deleteState, deleteAction] = useActionState(deleteReview, { error: '', message: '' });
    const [updateState, updateAction] = useActionState(updateReview, { error: '', message: '' });
    const [editContent, setEditContent] = useState(review.content);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        await updateAction(formData);
        onEditEnd();
        onRefresh?.();
    };

    const renderActionError = (error: string | Record<string, string[]>) => {
        if (typeof error === 'string') {
            return <p className={styles.error}>{error}</p>;
        }
        return null;
    };

    return (
        <div className={styles.reviewItem} style={style}>
            <div className={styles.reviewContent}>
                <div className={styles.reviewHeader}>
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>{review.profile?.name || '알 수 없음'}</div>
                    </div>
                    {isAuthor && (
                        <div className={styles.reviewActions}>
                            {isEditing ? (
                                <>
                                    <button type="submit" form="editForm" className={styles.editButton}>저장</button>
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => {
                                            onEditEnd();
                                        }}
                                    >
                                        취소
                                    </button>
                                </>
                            ) : (
                                <div className={styles.reviewActions}>
                                    <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onEditStart();
                                            }}
                                            className={styles.editButton}
                                        >
                                            수정
                                        </button>
                                        <div style={{ display: 'inline' }}>
                                            <form action={deleteAction} style={{ display: 'inline' }}>
                                                <input type="hidden" name="reviewId" value={review.id} />
                                                <input type="hidden" name="userId" value={review.profile?.id} />
                                                <button
                                                    type="submit"
                                                    className={styles.deleteButton}
                                                    onClick={(e) => {
                                                        if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    삭제
                                                </button>
                                            </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {deleteState.error && renderActionError(deleteState.error)}
                {updateState.error && renderActionError(updateState.error)}

                {isEditing ? (
                    <form id="editForm" onSubmit={handleSubmit}>
                        <textarea
                            name="content"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className={styles.reviewTextArea}
                            required
                            autoFocus
                        />
                        <input type="hidden" name="reviewId" value={review.id} />
                        <input type="hidden" name="userId" value={review.profile?.id || ''} />
                    </form>
                ) : (
                        <p className={styles.reviewText}>{review.content}</p>
                )}
            </div>
        </div>
    );
} 