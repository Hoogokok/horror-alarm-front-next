'use client';

import Link from 'next/link';
import styles from '../styles/reviews.module.css';
import { ErrorType } from '@/types/error';
import { FormEventHandler } from 'react';
import { ReviewError } from './ReviewError';

interface ReviewFormProps {
    isLogin: boolean;
    isReviewed: boolean;
    movieId: string;
    userId: string;
    userName: string;
    theMovieDbId: string;
    category: string;
    error?: ErrorType;
    message?: string;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

export function ReviewForm({
    isLogin,
    isReviewed,
    movieId,
    userId,
    userName,
    theMovieDbId,
    category,
    error,
    message,
    onSubmit
}: ReviewFormProps) {
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
            <form onSubmit={onSubmit} role='form'>
                <textarea
                    name='review'
                    placeholder="이 영화에 대한 리뷰를 작성해주세요..."
                    className={styles.reviewInput}
                    required
                />
                <input type="hidden" name="movie_id" value={movieId} />
                <input type="hidden" name="user_name" value={userName} />
                <input type="hidden" name="user_id" value={userId} />
                <input type="hidden" name="the_movie_db_id" value={theMovieDbId} />
                <input type="hidden" name="category" value={category} />
                <button type="submit">리뷰 제출</button>
            </form>
            <ReviewError error={error} />
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
} 