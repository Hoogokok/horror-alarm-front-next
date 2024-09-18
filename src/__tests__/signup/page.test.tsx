import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import * as React from 'react'

// useActionState 모킹
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useActionState: vi.fn(() => [{
      error: {
        email: undefined,
        password: undefined,
        name: undefined,
      },
      message: '',
    }, vi.fn()]),
  }
})

// signup 액션 모킹
vi.mock('@/app/auth/lib/actions', () => ({
  signup: vi.fn(),
}))

import SignupPage from '@/app/signup/page'

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('회원가입 폼이 렌더링되어야 합니다', () => {
    render(<SignupPage />)

    expect(screen.getByPlaceholderText('이메일을 입력하세요')).toBeDefined()
    expect(screen.getByPlaceholderText('비밀번호를 입력하세요')).toBeDefined()
    expect(screen.getByPlaceholderText('별명을 입력하세요')).toBeDefined()
    expect(screen.getByText('회원가입')).toBeDefined()
    expect(screen.getByRole('form')).toBeDefined()
  })

})
