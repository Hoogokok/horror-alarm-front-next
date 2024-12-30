'use client';

import { Review, MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import styles from '../styles/reviews.module.css';
import commonStyles from '../styles/common.module.css';
import ReviewItem from './ReviewItem';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RefObject } from 'react';

interface ReviewListProps {
    reviews: Review[];
    currentUserId?: string;
    movie: MovieDetailResponseDto;
    category: string;
    parentRef: RefObject<HTMLDivElement>;
    currentPage: number;
    totalReviews: number;
    onPageChange: (page: number) => void;
}

export default function ReviewList({
    reviews,
    currentUserId,
    movie,
    category,
    parentRef,
    currentPage,
    totalReviews,
    onPageChange
}: ReviewListProps) {
    const rowVirtualizer = useVirtualizer({
        count: reviews.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5,
    });

    return (
        <>
            <div ref={parentRef} className={styles.reviewList} style={{ height: '400px', overflow: 'auto' }}>
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const review = reviews[virtualRow.index];
                        return (
                            <ReviewItem
                                key={virtualRow.index}
                                review={review}
                                currentUserId={currentUserId}
                                movie={movie}
                                category={category}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                onRefresh={() => onPageChange(currentPage)}
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