import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { Review } from '@/types/movie-detail-response-dto';

interface ReviewCreateData {
    review_content: string;
    review_movie_id: string;
    review_user_id: string;
    review_user_name: string;
}

interface ReviewUpdateData {
    id: string;
    content: string;
    userId: string;
}

interface ServiceResult<T> {
    data?: T;
    error?: string | Record<string, string[]>;
}

const reviewSchema = z.object({
    review_content: z.string()
        .min(1, "리뷰는 1자 이상이어야 합니다")
        .max(1000, "리뷰는 1000자 이하이어야 합니다"),
    review_movie_id: z.string(),
    review_user_id: z.string(),
    review_user_name: z.string(),
    category: z.string(),
    the_movie_db_id: z.string()
});

const updateReviewSchema = z.object({
    id: z.string(),
    content: z.string()
        .min(1, "리뷰는 1자 이상이어야 합니다")
        .max(1000, "리뷰는 1000자 이하이어야 합니다"),
    userId: z.string()
});

export class ReviewService {
    private static supabase = createClient();

    static async createReview(data: ReviewCreateData) {
        console.log('ReviewService.createReview - Input data:', data);

        const validationResult = await this.validateReviewData(data);
        console.log('Validation result:', validationResult);

        if (validationResult?.error) {
            console.log('Validation failed:', validationResult.error);
            throw new Error('Validation failed', {
                cause: validationResult.error 
            });
        }

        console.log('Attempting to insert review into DB');
        const { data: review, error } = await this.supabase
            .from('reviews')
            .insert([{
                review_movie_id: data.review_movie_id,
                review_user_id: data.review_user_id,
                review_content: data.review_content,
                review_user_name: data.review_user_name
            }])
            .select()
            .single();

        if (error) {
            console.log('DB error:', error);
            throw new Error('Failed to create review', { 
                cause: error.message || '알 수 없는 오류가 발생했습니다.' 
            });
        }

        console.log('Review created successfully:', review);
        return review;
    }

    static async validateReviewData(data: ReviewCreateData) {
        console.log('Validating review data:', data);
        const validation = reviewSchema.safeParse(data);
        console.log('Validation schema result:', validation);

        if (!validation.success) {
            return {
                error: validation.error.flatten().fieldErrors
            };
        }

        return null;
    }

    static async updateReview(data: ReviewUpdateData): Promise<ServiceResult<Review>> {
        // 권한 체크
        const { data: existingReview, error: checkError } = await this.supabase
            .from('reviews')
            .select('review_user_id')
            .eq('id', data.id)
            .single();

        if (checkError) {
            return { error: '리뷰를 찾을 수 없습니다.' };
        }

        if (existingReview.review_user_id !== data.userId) {
            return { error: '리뷰를 수정할 권한이 없습니다.' };
        }

        // 유효성 검사
        const validation = updateReviewSchema.safeParse(data);
        if (!validation.success) {
            return { error: validation.error.flatten().fieldErrors };
        }

        // 업데이트 수행
        const { data: review, error } = await this.supabase
            .from('reviews')
            .update({ review_content: data.content })
            .eq('id', data.id)
            .select()
            .single();

        if (error) {
            return { error: '리뷰 수정에 실패했습니다.' };
        }

        return { data: review };
    }
} 