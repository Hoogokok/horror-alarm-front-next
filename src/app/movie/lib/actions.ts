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
    }
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
    console.log(validation.data)
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
    revalidatePath(url)
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
    }
    message?: string
}

export async function review(prevState: ReviewState, formData: FormData) {
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
    const { data, error } = await supabase.from('reviews').insert([{review_movie_id: the_movie_db_id, review_user_id: user_id, review_content: review}])
    if (error) {
        console.log(error)
        return {
            error: error.message,
            message: "리뷰 등록 실패"
        }
    }
    const url = `/movie/${movie_id}/${category}`
    revalidatePath(url)
    redirect(url)
}
