import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const movieId = searchParams.get('movieId');
    const page = searchParams.get('page');

    try {
        const response = await fetch(
            `${process.env.MOVIE_API}/movies/${category}/${movieId}/reviews?page=${page}`,
            {
                headers: {
                    'X-API-KEY': process.env.MOVIE_API_KEY || ''
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('리뷰 조회 중 오류:', error);
        return NextResponse.json(
            { error: '리뷰를 불러오는데 실패했습니다.' },
            { status: 500 }
        );
    }
} 