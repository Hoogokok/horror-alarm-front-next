'use client';

import { Review, MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import styles from '../styles/reviews.module.css';
import commonStyles from '../styles/common.module.css';
import ReviewItem from './ReviewItem';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RefObject, useState, useCallback, useEffect } from 'react';
import ReviewForm from './ReviewForm';

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
    onReviewCreate: (newReview: Review) => void;
    userName?: string;
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
    onReviewCreate,
    userName
}: ReviewListProps) {
    const [localReviews, setLocalReviews] = useState(reviews);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

    useEffect(() => {
        setLocalReviews(reviews);
    }, [reviews]);

    const handleReviewUpdate = useCallback((updatedReview: Review) => {
        setLocalReviews(prev =>
            prev.map(review =>
                review.id === updatedReview.id ? updatedReview : review
            )
        );
    }, []);

    const handleReviewDelete = useCallback((deletedReviewId: string) => {
        setLocalReviews(prev => prev.filter(review => review.id !== deletedReviewId));
    }, []);

    const handleReviewCreate = useCallback((newReview: Review) => {
        setLocalReviews(prev => [newReview, ...prev]);
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: localReviews.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 190,
        overscan: 5,
        measureElement: (element) => {
            return element.getBoundingClientRect().height;
        }
    });

    return (
        <>
            <ReviewForm
                isLogin={isLogin}
                isReviewed={isReviewed}
                movieId={movie.id}
                userId={currentUserId || ''}
                userName={userName || ''}
                theMovieDbId={movie.theMovieDbId}
                category={category}
                onSuccess={handleReviewCreate}
            />
            <div ref={parentRef} className={styles.reviewList} style={{ height: '400px', overflow: 'auto' }}>
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                        gap: '16px',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const review = localReviews[virtualRow.index];
                        return (
                            <ReviewItem
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
                                onEditStart={() => setEditingReviewId(review.id)}
                                onEditEnd={() => setEditingReviewId(null)}
                                onUpdate={handleReviewUpdate}
                                onDelete={handleReviewDelete}
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
        </>
    );
} 