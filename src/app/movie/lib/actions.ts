'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server'
import { ReviewService } from './services/reviewService';

const rateSchema = z.object({
    movie_id: z.string(),
    rating: z.number().min(0, "평점은 0 이상이어야 합니다").max(5, "평점은 5 이하이어야 합니다"),
    user_id: z.string(),
    the_movie_db_id: z.string(),
    category: z.string(),
})

export type RateState = {
    error?: {
        movie_id?: string[]
        rating?: string[]
        user_id?: string[]
        the_movie_db_id?: string[]
        category?: string[]
    } | string
    message?: string
}

export async function rate(prevState: RateState, formData: FormData) {
    const supabase = createClient()

    const validation = rateSchema.safeParse({
        movie_id: formData.get('movie_id') as string,
        rating: Number(formData.get('rating')) as number,
        user_id: formData.get('user_id') as string,
        the_movie_db_id: formData.get('the_movie_db_id') as string,
        category: formData.get('category') as string,
    })

    if (!validation.success) {
        const error = validation.error.flatten().fieldErrors
        console.log(error)
        return {
            error: error,
            message: error.rating?.[0] || "평점 등록 실패"
        }
    }
    const { user_id, the_movie_db_id, category, rating, movie_id } = validation.data
    const { data, error } = await supabase.from('rate').insert([{rate_user_id: user_id, rate_movie_id: the_movie_db_id, score: rating}])
    if (error) {
        console.log(error)
        return {
            error: error.message,
            message: "평점 등록 실패"
        }
    }
    const url = `/movie/${movie_id}/${category}`
    revalidatePath(url, 'page')
    redirect(url)
}

const reviewSchema = z.object({
    movie_id: z.string(),
    user_id: z.string(),
    the_movie_db_id: z.string(),
    category: z.string(),
    review: z.string().min(1, "리뷰는 1자 이상이어야 합니다").max(1000, "리뷰는 1000자 이하이어야 합니다"),
})

export type ReviewState = {
    error?: {
        movie_id?: string[]
        user_id?: string[]
        the_movie_db_id?: string[]
        category?: string[]
        review?: string[]
    } | string
    message?: string
    data?: {
        id: string;
        userName: string;
    }
}

export async function review(prevState: ReviewState, formData: FormData) {
    try {
        const reviewData = {
            review_content: formData.get('review') as string,
            review_movie_id: formData.get('the_movie_db_id') as string,
            review_user_id: formData.get('user_id') as string,
            review_user_name: formData.get('user_name') as string,
            category: formData.get('category') as string,
            the_movie_db_id: formData.get('the_movie_db_id') as string
        };

        const review = await ReviewService.createReview(reviewData);

        const url = `/movie/${formData.get('movie_id')}/${formData.get('category')}`;
        revalidatePath(url);

        return { 
            message: "리뷰가 등록되었습니다.",
            data: review
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                error: error.cause || error.message,
                message: "리뷰 등록 실패"
            };
        }
        return {
            error: "알 수 없는 오류가 발생했습니다.",
            message: "리뷰 등록 실패"
        };
    }
}

interface UpdateReviewState {
    error?: string | Record<string, string[]>;
    message?: string;
    success?: boolean;
}

interface DeleteReviewState {
    error?: string;
    message?: string;
    success?: boolean;
}

export async function deleteReview(prevState: DeleteReviewState, formData: FormData): Promise<DeleteReviewState> {
    try {
        const supabase = createClient()
        const reviewId = formData.get('reviewId') as string;
        const userId = formData.get('userId') as string;
        const movie_id = formData.get('movie_id') as string;
        const category = formData.get('category') as string;

        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .select('review_user_id')
            .eq('id', reviewId)
            .single();

        if (reviewError) {
            return { error: '리뷰를 찾을 수 없습니다.' };
        }

        // 권한 체크
        if (review.review_user_id !== userId) {
            return { error: '리뷰를 삭제할 권한이 없습니다.' };
        }

        const { error: deleteError } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (deleteError) {
            return { error: '리뷰 삭제에 실패했습니다.' };
        }

        const url = `/movie/${movie_id}/${category}`;
        revalidatePath(url);
        return { message: '리뷰가 삭제되었습니다.', success: true };
    } catch (error) {
        return { error: '리뷰 삭제 중 오류가 발생했습니다.' };
    }
}

const updateReviewSchema = z.object({
    reviewId: z.string(),
    userId: z.string(),
    content: z.string().min(1, "리뷰는 1자 이상이어야 합니다").max(1000, "리뷰는 1000자 이하이어야 합니다"),
    movie_id: z.string(),
    category: z.string(),
});

export async function updateReview(prevState: UpdateReviewState, formData: FormData): Promise<UpdateReviewState> {
    const reviewData = {
        id: formData.get('reviewId') as string,
        content: formData.get('content') as string,
        userId: formData.get('userId') as string,
    };

    const result = await ReviewService.updateReview(reviewData);

    if (result.error) {
        return {
            error: result.error,
            message: "리뷰 수정 실패"
        };
    }

    const url = `/movie/${formData.get('movie_id')}/${formData.get('category')}`;
    revalidatePath(url);

    return {
        message: '리뷰가 수정되었습니다.',
        success: true
    };
}
