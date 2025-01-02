'use client';

import { Review, MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import styles from '../styles/reviews.module.css';
import commonStyles from '../../styles/common.module.css';
import { ReviewItemContainer } from '../containers/ReviewItemContainer';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RefObject } from 'react';
import { ReviewFormContainer } from '../containers/ReviewFormContainer';

interface ReviewListProps {
    reviews: Review[];
    currentUserId?: string;
    movie: MovieDetailResponseDto;
    category: string;
    parentRef: RefObject<HTMLDivElement>;
    currentPage: number;
    totalReviews: number;
    onPageChange: (page: number) => void;
    isLogin: boolean;
    isReviewed: boolean;
    userName?: string;
    // CRUD 관련 props
    onReviewCreate: (newReview: Review) => void;
    onReviewUpdate: (updatedReview: Review) => void;
    onReviewDelete: (deletedReviewId: string) => void;
    // 수정 모드 관련 props
    editingReviewId: string | null;
    onEditStart: (reviewId: string) => void;
    onEditEnd: () => void;
}

export default function ReviewList({
    reviews,
    currentUserId,
    movie,
    category,
    parentRef,
    currentPage,
    totalReviews,
    onPageChange,
    isLogin,
    isReviewed,
    userName,
    onReviewCreate,
    onReviewUpdate,
    onReviewDelete,
    editingReviewId,
    onEditStart,
    onEditEnd
}: ReviewListProps) {
    const rowVirtualizer = useVirtualizer({
        count: reviews.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 190,
        overscan: 5,
        measureElement: (element) => element.getBoundingClientRect().height
    });

    return (
        <div className={styles.reviewContainer}>
            <ReviewFormContainer
                isLogin={isLogin}
                isReviewed={isReviewed}
                movieId={movie.id}
                userId={currentUserId || ''}
                userName={userName || ''}
                theMovieDbId={movie.theMovieDbId}
                category={category}
                onSuccess={onReviewCreate}
            />

            {reviews.length > 0 ? (
                <div className={styles.reviewListSection}>
                    <div
                        ref={parentRef}
                        className={styles.reviewList}
                        style={{ height: '400px', overflow: 'auto' }}
                    >
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                                gap: '16px',
                            }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const review = reviews[virtualRow.index];
                                return (
                                    <ReviewItemContainer
                                        key={review.id}
                                        review={review}
                                        currentUserId={currentUserId}
                                        movie={movie}
                                        category={category}
                                        style={{
                                            position: 'absolute',
                                            top: `${virtualRow.start}px`,
                                            left: 0,
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                        onRefresh={() => onPageChange(currentPage)}
                                        isEditing={editingReviewId === review.id}
                                        onEditStart={() => onEditStart(review.id)}
                                        onEditEnd={onEditEnd}
                                        onUpdate={onReviewUpdate}
                                        onDelete={onReviewDelete}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className={commonStyles.pagination}>
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>
                        <span>{currentPage}</span>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage * 10 >= totalReviews}
                        >
                            다음
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.noReviews}>
                    <p>아직 작성된 리뷰가 없습니다.</p>
                    <p>첫 번째 리뷰를 작성해보세요!</p>
                </div>
            )}
        </div>
    );
} 