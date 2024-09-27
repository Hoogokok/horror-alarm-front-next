import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import * as React from 'react'

// useActionState 모킹 수정
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
    }, vi.fn(), false]), // dispatch 함수와 isPending 상태 추가
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

  it('이메일 입력 필드에 값을 입력할 수 있어야 합니다', () => {
    render(<SignupPage />)
    const emailInput = screen.getByPlaceholderText('이메일을 입력하세요') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('비밀번호 입력 필드에 값을 입력할 수 있어야 합니다', () => {
    render(<SignupPage />)
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요') as HTMLInputElement
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    expect(passwordInput.value).toBe('password123')
  })

  it('별명 입력 필드에 값을 입력할 수 있어야 합니다', () => {
    render(<SignupPage />)
    const nameInput = screen.getByPlaceholderText('별명을 입력하세요') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: '테스터' } })
    expect(nameInput.value).toBe('테스터')
  })

  it('회원가입 버튼을 클릭하면 formAction이 호출되어야 합니다', async () => {
    const mockFormAction = vi.fn()
    vi.mocked(React.useActionState).mockReturnValue([{
      error: {
        email: undefined,
        password: undefined,
        name: undefined,
      },
      message: '',
    }, mockFormAction, false]) // isPending 상태 추가

    render(<SignupPage />)
    const submitButton = screen.getByText('회원가입')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalled()
    })
  })

  it('에러 메시지가 표시되어야 합니다', () => {
    vi.mocked(React.useActionState).mockReturnValue([{
      error: {
        email: ['유효하지 않은 이메일 주소입니다'],
        password: ['비밀번호는 8자 이상이어야 합니다'],
        name: ['별명은 필수 입력 항목입니다'],
      },
      message: '',
    }, vi.fn(), false]) // dispatch

    render(<SignupPage />)

    expect(screen.getByText('유효하지 않은 이메일 주소입니다')).toBeDefined()
    expect(screen.getByText('비밀번호는 8자 이상이어야 합니다')).toBeDefined()
    expect(screen.getByText('별명은 필수 입력 항목입니다')).toBeDefined()
  })

  it('이메일 형식이 잘못된 경우 에러 메시지가 표시되어야 합니다', () => {
    vi.mocked(React.useActionState).mockReturnValue([{
      error: {
        email: ['이메일 형식이 올바르지 않습니다'],
        password: undefined,
        name: undefined,
      },
      message: '',
    }, vi.fn(), false])

    render(<SignupPage />)
    expect(screen.getByText('이메일 형식이 올바르지 않습니다')).toBeDefined()
  })

  it('비밀번호가 조건을 만족하지 않는 경우 에러 메시지가 표시되어야 합니다', () => {
    vi.mocked(React.useActionState).mockReturnValue([{
      error: {
        email: undefined,
        password: ['비밀번호는 최소 8자 이상이어야 합니다', '비밀번호는 최소 하나의 특수문자를 포함해야 합니다'],
        name: undefined,
      },
      message: '',
    }, vi.fn(), false])

    render(<SignupPage />)
    expect(screen.getByText('비밀번호는 최소 8자 이상이어야 합니다')).toBeDefined()
  })

  it('로딩 중일 때 버튼이 비활성화되어야 합니다', () => {
    vi.mocked(React.useActionState).mockReturnValue([{
      error: {
        email: undefined,
        password: undefined,
        name: undefined,
      },
      message: '',
    }, vi.fn(), true]) // isPending을 true로 설정

    render(<SignupPage />)
    const submitButton = screen.getByText('회원가입') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  it('서버 에러 발생 시 에러 메시지가 표시되어야 합니다', () => {
    vi.mocked(React.useActionState).mockReturnValue([{
      error: {
        email: undefined,
        password: undefined,
        name: undefined,
      },
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }, vi.fn(), false])

    render(<SignupPage />)
    expect(screen.getByText('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')).toBeDefined()
  })
})
