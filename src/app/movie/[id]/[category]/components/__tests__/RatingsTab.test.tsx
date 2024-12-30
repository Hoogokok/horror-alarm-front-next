import { render, screen } from '@testing-library/react';
import RatingsTab from '../RatingsTab';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { UserWithMovieIds } from '@/types/user';
import { RATING_MESSAGES, FORM_LABELS } from '@/constants/rating';
import { User } from '@supabase/auth-helpers-nextjs';
import { describe, it, expect, vi } from 'vitest';

// Server Action Mock
vi.mock('@/app/movie/lib/actions', () => ({
    rate: vi.fn(),
    useActionState: () => [
        { error: {}, message: '' },
        vi.fn()
    ]
}));

const mockMovie: MovieDetailResponseDto = {
    id: "1",
    title: '테스트 영화',
    overview: '테스트 설명',
    posterPath: '/test.jpg',
    releaseDate: '2024-01-01',
    runtime: 120,
    voteAverage: 4.5,
    voteCount: 100,
    theMovieDbId: '123',
    recentReviews: [],
    totalReviews: 0,
};

const mockUser: UserWithMovieIds = {
    user: {
        id: 'test-user',
        email: 'test@example.com',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
    } as User,
    rate_movieIds: [],
    review_movieIds: [],
};

describe('RatingsTab 컴포넌트', () => {
    it('비로그인 상태에서는 로그인 안내 메시지를 표시해야 함', () => {
        render(
            <RatingsTab
                movie={mockMovie}
                userWithMovieIds={{
                    user: null,
                    rate_movieIds: [],
                    review_movieIds: []
                }}
                category="streaming"
            />
        );

        expect(screen.getByText(RATING_MESSAGES.LOGIN_REQUIRED)).toBeDefined();
    });

    it('이미 평점을 준 경우 안내 메시지를 표시해야 함', () => {
        const ratedUser = {
            ...mockUser,
            rate_movieIds: [123],
        };

        render(
            <RatingsTab
                movie={mockMovie}
                userWithMovieIds={ratedUser}
                category="streaming"
            />
        );

        expect(screen.getByText(RATING_MESSAGES.ALREADY_RATED)).toBeDefined();
    });

    it('로그인 상태에서는 평점 입력 폼을 표시해야 함', () => {
        render(
            <RatingsTab
                movie={mockMovie}
                userWithMovieIds={mockUser}
                category="streaming"
            />
        );

        const form = screen.getByRole('form', { name: FORM_LABELS.RATING_FORM });
        const submitButton = screen.getByRole('button', { name: FORM_LABELS.SUBMIT_BUTTON });

        expect(form).toBeDefined();
        expect(submitButton.hasAttribute('disabled')).toBe(true);
    });
});