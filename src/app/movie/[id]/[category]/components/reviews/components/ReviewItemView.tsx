import { Review } from '@/types/movie-detail-response-dto';
import styles from '../styles/reviews.module.css';

interface ReviewItemViewProps {
    review: Review;
    isAuthor: boolean;
    isEditing: boolean;
    editContent: string;
    onEditContentChange: (content: string) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
    onEditSubmit: (e: React.FormEvent) => void;
    onDeleteClick: (e: React.MouseEvent) => void;
    error?: string;
    style?: React.CSSProperties;
    movie: any;
    category: string;
}

export function ReviewItemView({ 
    review,
    isAuthor,
    isEditing,
    editContent,
    onEditContentChange,
    onEditStart,
    onEditEnd,
    onEditSubmit,
    onDeleteClick,
    movie,
    category,
    error,
}: ReviewItemViewProps) {
    return (
        <div className={styles.reviewItem}>
            {isEditing ? (
                <form id="editForm" role="form" onSubmit={onEditSubmit}>
                    <div className={styles.reviewContent}>
                        <div className={styles.reviewHeader}>
                            <div className={styles.authorInfo}>
                                <div className={styles.authorName}>{review.profile?.name}</div>
                            </div>
                            {isAuthor && (
                                <div className={styles.reviewActions}>
                                    <button type="submit" className={styles.editButton}>저장</button>
                                    <button type="button" onClick={onEditEnd} className={styles.deleteButton}>취소</button>
                                </div>
                            )}
                        </div>
                        <textarea
                            name="content"
                            value={editContent}
                            onChange={e => onEditContentChange(e.target.value)}
                            className={styles.reviewTextArea}
                            required
                        />
                        <input type="hidden" name="reviewId" value={review.id} />
                        <input type="hidden" name="userId" value={review.profile?.id || ''} />
                        <input type="hidden" name="movie_id" value={movie.id} />
                        <input type="hidden" name="category" value={category} />
                    </div>
                </form>
            ) : (
                    <div className={styles.reviewContent}>
                        <div className={styles.reviewHeader}>
                            <div className={styles.authorInfo}>
                                <div className={styles.authorName}>{review.profile?.name}</div>
                            </div>
                            {isAuthor && (
                                <div className={styles.reviewActions}>
                                    <button className={styles.editButton} onClick={onEditStart}>수정</button>
                                    <button type="button" onClick={onDeleteClick} className={styles.deleteButton}>삭제</button>
                                </div>
                            )}
                        </div>
                        <p className={styles.reviewText}>{review.content}</p>
                    </div>
            )}
            {error && (
                <div className={styles.error} data-testid="error-message">
                    {error}
                </div>
            )}
        </div>
    );
} 