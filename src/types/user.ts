import { User as SupabaseUser } from '@supabase/auth-helpers-nextjs'

export type User = SupabaseUser

export interface UserWithMovieIds {
    user: User | null;
    rate_movieIds: string[];
    review_movieIds: string[];
}