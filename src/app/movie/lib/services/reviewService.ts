import { createClient } from '@/utils/supabase/server';
import { Review } from '@/types/movie-detail-response-dto';
import { z } from 'zod';

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

export class ReviewService {
    private static supabase = createClient();

    static async createReview(data: ReviewCreateData) {
        const validationResult = await this.validateReviewData(data);
        if (validationResult?.error) {
            throw new Error('Validation failed', {
                cause: validationResult.error
            });
        }

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
            throw new Error('Failed to create review', {
                cause: error.message
            });
        }

        return review;
    }

    static async validateReviewData(data: ReviewCreateData) {
        const validation = reviewSchema.safeParse(data);

        if (!validation.success) {
            return {
                error: validation.error.flatten().fieldErrors
            };
        }

        return null;
    }
} 