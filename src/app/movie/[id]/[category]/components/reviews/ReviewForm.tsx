'use client';

import { review, ReviewState } from '@/app/movie/lib/actions';
import { useActionState } from 'react';
import Link from 'next/link';
import styles from '../styles/reviews.module.css';
import commonStyles from '../styles/common.module.css';

interface ReviewFormProps {
    isLogin: boolean;
    isReviewed: boolean;
    movieId: string;
    userId: string;
    theMovieDbId: string;
    category: string;
}

export default function ReviewForm({ isLogin, isReviewed, movieId, userId, theMovieDbId, category }: ReviewFormProps) {
    const initialState: ReviewState = { error: {}, message: "" };
    const [reviewState, reviewAction] = useActionState(review, initialState);

    const renderError = () => {
        if (typeof reviewState.error === 'string') {
            return <p className={commonStyles.error}>{reviewState.error}</p>;
        } else if (reviewState.error) {
            return (
                <ul className={styles.errorList}>
                    {Object.entries(reviewState.error).map(([key, errors]) => (
                        errors && errors.map((error, index) => (
                            <li key={`${key}-${index}`} className={styles.errorItem}>{error}</li>
                        ))
                    ))}
                </ul>
            );
        }
        return null;
    };

    if (!isLogin) {
        return (
            <p className={styles.loginPrompt}>
                <Link href="/login">로그인</Link>하고 리뷰를 작성해보세요!
            </p>
        );
    }

    if (isReviewed) {
        return <p className={styles.rated}>이미 리뷰를 작성했습니다.</p>;
    }

    return (
        <div className={styles.reviewForm}>
            <h3 className={styles.reviewTitle}>리뷰 작성하기</h3>
            <form action={reviewAction} role='form'>
                <textarea
                    name='review'
                    placeholder="이 영화에 대한 리뷰를 작성해주세요..."
                    className={styles.reviewInput}
                    required
                />
                <input type="hidden" name="movie_id" value={movieId} />
                <input type="hidden" name="user_id" value={userId} />
                <input type="hidden" name="the_movie_db_id" value={theMovieDbId} />
                <input type="hidden" name="category" value={category} />
                <button type="submit">리뷰 제출</button>
            </form>
            {renderError()}
            {reviewState.message && <p className={styles.message}>{reviewState.message}</p>}
        </div>
    );
} 