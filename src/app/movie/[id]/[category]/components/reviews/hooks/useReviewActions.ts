import { deleteReview, updateReview } from '@/app/movie/lib/actions';
import { useActionState } from 'react';

export function useReviewActions() {
    const [deleteState, deleteAction] = useActionState(deleteReview, { error: '', message: '' });
    const [updateState, updateAction] = useActionState(updateReview, { error: '', message: '' });

    return {
        deleteState,
        deleteAction,
        updateState,
        updateAction
    };
} 