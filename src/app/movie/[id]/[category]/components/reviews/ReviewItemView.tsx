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
    error,
    style,
    movie,
    category
}: ReviewItemViewProps) {
    const showActions = isAuthor === true;

    return (
        <div className={styles.reviewItem} style={style}>
            <div className={styles.reviewContent}>
                <div className={styles.reviewHeader}>
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>{review.profile?.name || '알 수 없음'}</div>
                    </div>
                    {showActions && (
                        <div className={styles.reviewActions}>
                            {isEditing ? (
                                <>
                                    <button type="submit" form="editForm" className={styles.editButton}>저장</button>
                                    <button type="button" className={styles.deleteButton} onClick={onEditEnd}>
                                        취소
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();  // 이벤트 전파 중지
                                            onEditStart();
                                        }}
                                        className={styles.editButton}
                                    >
                                        수정
                                    </button>
                                    <button type="button" onClick={onDeleteClick} className={styles.deleteButton}>
                                        삭제
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {error && <p className={styles.error}>{error}</p>}

                {isEditing ? (
                    <form id="editForm" onSubmit={onEditSubmit}>
                        <textarea
                            name="content"
                            value={editContent}
                            onChange={(e) => onEditContentChange(e.target.value)}
                            className={styles.reviewTextArea}
                            required
                            autoFocus
                        />
                        <input type="hidden" name="reviewId" value={review.id} />
                        <input type="hidden" name="userId" value={review.profile?.id || ''} />
                        <input type="hidden" name="movie_id" value={movie.id} />
                        <input type="hidden" name="category" value={category} />
                    </form>
                ) : (
                    <p className={styles.reviewText}>{review.content}</p>
                )}
            </div>
        </div>
    );
} 