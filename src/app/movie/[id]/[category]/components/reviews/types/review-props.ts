import { MovieDetailResponseDto, Review } from "@/types/movie-detail-response-dto";
import { ErrorType } from "@/types/error";
import { CSSProperties } from "react";

export interface ReviewBaseProps {
    review: Review;
    movie: MovieDetailResponseDto;
    category: string;
}

export interface ReviewEditState {
    isEditing: boolean;
    editContent: string;
}

export interface ReviewEditActions {
    onEditStart: () => void;
    onEditEnd: () => void;
    onUpdate: (updatedReview: Review) => void;
    onDelete: (deletedReviewId: string) => void;
}

export interface ReviewItemProps extends ReviewBaseProps {
    currentUserId?: string;
    style: CSSProperties;
    error?: string;
    isEditing: boolean;
    editContent: string;
    onEditContentChange: (content: string) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export interface ReviewFormProps {
    isLogin: boolean;
    isReviewed: boolean;
    movieId: string;
    userId: string;
    userName: string;
    theMovieDbId: string;
    category: string;
    onSuccess?: (newReview: Review) => void;
}

export interface ReviewItemViewProps extends ReviewBaseProps {
    isAuthor: boolean;
    isEditing: boolean;
    editContent: string;
    onEditContentChange: (content: string) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
    onEditSubmit: (e: React.FormEvent) => void;
    onDeleteClick: (e: React.MouseEvent) => void;
    error?: ErrorType;
    style?: CSSProperties;
}

export interface ReviewListProps extends Pick<ReviewFormProps, 'isLogin' | 'isReviewed' | 'userName'> {
    reviews: Review[];
    currentUserId?: string;
    movie: MovieDetailResponseDto;
    category: string;
    currentPage: number;
    totalReviews: number;
    onPageChange: (page: number) => void;
    onReviewCreate: (newReview: Review) => void;
    onReviewUpdate: (updatedReview: Review) => void;
    onReviewDelete: (deletedReviewId: string) => void;
    editingReviewId: string | null;
    onEditStart: (reviewId: string) => void;
    onEditEnd: () => void;
}

export interface OptimisticReview extends Review {
    isOptimistic?: boolean;
    rollback?: () => void;
} 