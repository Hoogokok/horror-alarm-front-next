import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import React from 'react';

// 모든 vi.mock 호출을 파일 상단으로 이동
vi.mock('@/app/movie/[id]/[category]/components/tabs', () => {
  return {
    default: vi.fn(({ movie, user, rate_movieIds, review_movieIds, category }) => {
      return React.createElement('div', { 'data-testid': "mock-page-tabs" }, 
        `Mock PageTabs: ${movie.title}, ${user.id}, ${category}`
      )
    })
  }
})

vi.mock('next/font/local', () => ({
  default: () => ({
    style: {
      fontFamily: 'mocked-font'
    }
  })
}))

vi.mock('next/image', () => ({
  default: (props: any) => React.createElement('img', props)
}))

vi.mock('@/app/auth/lib/actions', () => {
  return {
    getUser: vi.fn(() => Promise.resolve({
      user: { id: 'test-user-id' },
      rate_movieIds: [],
      review_movieIds: []
    }))
  }
})

// MovieDetail 컴포넌트 import를 vi.mock 호출 이후로 이동
import MovieDetail from '@/app/movie/[id]/[category]/page'

// 환경 변수 설정
vi.stubEnv('MOVIE_API', 'http://test-api.com')
vi.stubEnv('POSTER_URL', 'http://test-poster.com/')

// 모의 영화 데이터
const mockMovie = {
  id: '123',
  the_movie_db_id: 'tmdb123',
  title: '테스트 영화',
  poster_path: '/test-poster.jpg',
  overview: '테스트 영화 줄거리',
  vote_average: 8.5,
  release_date: '2023-01-01',
  providers: ['Netflix', 'Amazon Prime'],
  reviews: ['좋은 영화예요', '재미있어요']
}

describe('MovieDetail 컴포넌트', () => {
  beforeEach(() => {
    // fetch 함수 모의 구현
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMovie),
      })
    ) as any
  })

  afterEach(() => {
    cleanup()
  })

  it('영화 정보를 올바르게 렌더링합니다', async () => {
    await render(await MovieDetail({ params: { id: '123', category: 'horror' } }))
    expect(screen.getByText('테스트 영화')).toBeDefined()
    expect(screen.getAllByAltText('테스트 영화')[0]).toBeDefined()
    expect(screen.getAllByAltText('테스트 영화')[0].getAttribute('src')).toBe('http://test-poster.com//test-poster.jpg')
    expect(screen.getByTestId('mock-page-tabs')).toBeDefined()
  })

  it('환경 변수가 올바르게 사용되는지 확인합니다', async () => {
    await render(await MovieDetail({ params: { id: '123', category: 'horror' } }))
    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-api.com/api/movie/123?category=horror',
      expect.anything()
    )
  })

  it('getUser 함수가 호출되는지 확인합니다', async () => {
    const { getUser } = await import('@/app/auth/lib/actions')
    await render(await MovieDetail({ params: { id: '123', category: 'horror' } }))
    expect(getUser).toHaveBeenCalled()
  })

  it('영화 포스터를 올바르게 렌더링합니다', async () => {
    await render(await MovieDetail({ params: { id: '123', category: 'horror' } }))
    const posters = screen.getAllByAltText('테스트 영화') as HTMLImageElement[]
    expect(posters.length).toBeGreaterThan(0)
    const poster = posters[0]
    expect(poster).toBeDefined()
    expect(poster.src).toBe('http://test-poster.com//test-poster.jpg')
    expect(poster.width).toBe(263)
    expect(poster.height).toBe(394)
  })

  it('영화 제목이 올바른 스타일로 렌더링됩니다', async () => {
    await render(await MovieDetail({ params: { id: '123', category: 'horror' } }))
    const titleElement = screen.getByText('테스트 영화')
    expect(titleElement).toBeDefined()
    expect(titleElement.className).toContain('_title_65291b')
    expect(titleElement.style.fontFamily).toBe('mocked-font')
  })
})
