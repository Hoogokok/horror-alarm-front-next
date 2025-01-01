import { ErrorType } from "@/types/error";
import { ReviewForm } from "../components/ReviewForm";
import { useReviewActions } from "../hooks/useReviewActions";
import { OptimisticReview } from "../types/review-props";

interface ReviewFormContainerProps {
    isLogin: boolean;
    isReviewed: boolean;
    movieId: string;
    userId: string;
    userName: string;
    theMovieDbId: string;
    category: string;
    onSuccess?: (newReview: OptimisticReview) => (() => void) | void;
}

export function ReviewFormContainer(props: ReviewFormContainerProps) {
    const { reviewState, reviewAction } = useReviewActions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const optimisticReview: OptimisticReview = {
            id: `temp-${Date.now()}`,
            content: formData.get('review') as string,
            review_user_id: props.userId,
            review_movie_id: props.theMovieDbId,
            created_at: new Date().toISOString(),
            profile: {
                id: props.userId,
                name: props.userName
            },
            isOptimistic: true
        };

        const rollback = props.onSuccess?.(optimisticReview);

        try {
            await reviewAction(formData);
            if (reviewState.error) {
                rollback?.();
            }
        } catch (error) {
            rollback?.();
        }
    };

    return (
        <ReviewForm
            {...props}
            error={reviewState.error as ErrorType}
            message={reviewState.message}
            onSubmit={handleSubmit}
        />
    );
} 