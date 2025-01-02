'use server'

import { createClient } from '@/utils/supabase/server'
import { UserWithMovieIds } from '@/types/user'

export async function getUser(): Promise<UserWithMovieIds> {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getUser()
        if (!data.user) {
            return {
                user: null,
                rate_movieIds: [],
                review_movieIds: [],
            }
        }

        const { data: rateData, error: rateError } = await supabase
            .from('rate')
            .select('rate_movie_id')
            .eq('rate_user_id', data.user.id)

        const { data: reviewData, error: reviewError } = await supabase
            .from('reviews')
            .select('review_movie_id')
            .eq('review_user_id', data.user.id)

        if (rateError) {
            console.log(rateError)
        }
        if (reviewError) {
            console.log(reviewError)
        }

        const movieIds = rateData?.map((rate: any) => rate.rate_movie_id) || []
        const reviewIds = reviewData?.map((review: any) => review.review_movie_id) || []

        return {
            user: data.user,
            rate_movieIds: movieIds,
            review_movieIds: reviewIds,
        }
    } catch (error) {
        console.error('사용자 정보 조회 중 오류 발생:', error)
        return { user: null, rate_movieIds: [], review_movieIds: [] }
    }
} 