'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server'

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
}

export async function review(prevState: ReviewState, formData: FormData): Promise<ReviewState> {
    const supabase = createClient()
    const validation = reviewSchema.safeParse({
        movie_id: formData.get('movie_id') as string,
        user_id: formData.get('user_id') as string,
        the_movie_db_id: formData.get('the_movie_db_id') as string,
        category: formData.get('category') as string,
        review: formData.get('review') as string,
    })

    if (!validation.success) {
        const error = validation.error.flatten().fieldErrors
        console.log(error)
        return {
            error: error,
            message: "리뷰 등록 실패"
        }
    }

    const { movie_id, user_id, the_movie_db_id, category, review } = validation.data

    // 먼저 유저 이름 조회
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user_id)
        .single();

    if (profileError) {
        console.log(profileError)
        return {
            error: profileError.message,
            message: "유저 정보 조회 실패"
        }
    }

    // 리뷰 생성 시 유저 이름도 함께 저장
    const { data, error } = await supabase
        .from('reviews')
        .insert([{
            review_movie_id: the_movie_db_id,
            review_user_id: user_id,
            review_content: review,
            review_user_name: profile.name
        }])

    if (error) {
        console.log(error)
        return {
            error: error.message,
            message: "리뷰 등록 실패"
        }
    }

    const url = `/movie/${movie_id}/${category}`
    revalidatePath(url, 'page')
    redirect(url)
}

interface UpdateReviewState {
    error?: string | Record<string, string[]>;
    message?: string;
}

interface DeleteReviewState {
    error?: string;
    message?: string;
}

export async function deleteReview(prevState: DeleteReviewState, formData: FormData): Promise<DeleteReviewState> {
    try {
        const supabase = createClient()
        const reviewId = formData.get('reviewId') as string;
        const userId = formData.get('userId') as string;

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

        revalidatePath('/movie/[id]/[category]', 'page');
        return { message: '리뷰가 삭제되었습니다.' };
    } catch (error) {
        console.error('리뷰 삭제 중 오류:', error);
        return { error: '리뷰 삭제 중 오류가 발생했습니다.' };
    }
}

const updateReviewSchema = z.object({
    reviewId: z.string(),
    userId: z.string(),
    content: z.string().min(1, "리뷰는 1자 이상이어야 합니다").max(1000, "리뷰는 1000자 이하이어야 합니다"),
});

export async function updateReview(prevState: UpdateReviewState, formData: FormData): Promise<UpdateReviewState> {
    try {
        const supabase = createClient()

        const validation = updateReviewSchema.safeParse({
            reviewId: formData.get('reviewId') as string,
            userId: formData.get('userId') as string,
            content: formData.get('content') as string,
        });

        if (!validation.success) {
            console.error('Validation failed:', validation.error);
            return {
                error: validation.error.flatten().fieldErrors,
                message: "리뷰 수정 실패"
            };
        }

        const { reviewId, userId, content } = validation.data;

        const { error: updateError } = await supabase
            .from('reviews')
            .update({ review_content: content })
            .eq('id', reviewId)
            .select();

        if (updateError) {
            console.error('Update error:', updateError);
            return { error: '리뷰 수정에 실패했습니다.' };
        }

        revalidatePath('/movie/[id]/[category]', 'page');
        return { message: '리뷰가 수정되었습니다.' };
    } catch (error) {
        console.error('Review update error:', error);
        return { error: '리뷰 수정 중 오류가 발생했습니다.' };
    }
}
