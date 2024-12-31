'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Review, MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import ReviewList from '../components/ReviewList';

interface ReviewListContainerProps {
    initialReviews: Review[];
    movie: MovieDetailResponseDto;
    category: string;
    currentUserId?: string;
    isLogin: boolean;
    isReviewed: boolean;
    userName?: string;
    onPageChange: (page: number) => void;
}

export function ReviewListContainer({
    initialReviews,
    movie,
    category,
    currentUserId,
    isLogin,
    isReviewed,
    userName,
    onPageChange
}: ReviewListContainerProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    const handleReviewUpdate = useCallback((updatedReview: Review) => {
        setReviews(prev =>
            prev.map(review =>
                review.id === updatedReview.id ? updatedReview : review
            )
        );
    }, []);

    const handleReviewDelete = useCallback((deletedReviewId: string) => {
        setReviews(prev => prev.filter(review => review.id !== deletedReviewId));
    }, []);

    const handleReviewCreate = useCallback((newReview: Review) => {
        setReviews(prev => [newReview, ...prev]);
    }, []);

    const handlePageChange = async (newPage: number) => {
        setCurrentPage(newPage);
        onPageChange(newPage);
    };

    return (
        <ReviewList
            reviews={reviews}
            currentUserId={currentUserId}
            movie={movie}
            category={category}
            parentRef={parentRef}
            currentPage={currentPage}
            totalReviews={movie.totalReviews}
            onPageChange={handlePageChange}
            isLogin={isLogin}
            isReviewed={isReviewed}
            userName={userName}
            onReviewCreate={handleReviewCreate}
            onReviewUpdate={handleReviewUpdate}
            onReviewDelete={handleReviewDelete}
            editingReviewId={editingReviewId}
            onEditStart={(id) => setEditingReviewId(id)}
            onEditEnd={() => setEditingReviewId(null)}
        />
    );
} 