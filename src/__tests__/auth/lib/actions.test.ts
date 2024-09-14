import { vi, describe, it, expect, beforeEach } from 'vitest'
import { login, LoginState, signup, SignupState, getUser, logout } from '@/app/auth/lib/actions'
import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Supabase 클라이언트 모킹
vi.mock('@/app/utils/supabase/server', () => ({
    createClient: vi.fn(() => ({
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        getUser: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnValue({
          data: [],
          error: null,
        }),
      })),
    })),
  }))


  // Next.js 함수 모킹
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
  }))

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
  }))

describe('signup', () => {
  let prevState: SignupState
  let formData: FormData

  beforeEach(() => {
    prevState = {
      error: undefined,
      message: undefined,
    }
    formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'Password123!')
    formData.append('name', 'Test User')

    vi.clearAllMocks()
  })

  it('성공적으로 회원가입을 수행해야 합니다', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
    } as any)

    await signup(prevState, formData)

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
      options: {
        data: {
          name: 'Test User',
        },
      },
    })
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('유효성 검사 실패 시(이메일 형식 올바르지 않음) 에러를 반환해야 합니다', async () => {
    formData.set('email', 'invalid-email')

    const result = await signup(prevState, formData)

    expect(result).toEqual({
      error: expect.objectContaining({
        email: expect.arrayContaining(['이메일 형식이 올바르지 않습니다']),
      }),
      message: "회원가입 실패",
    })
  })

  it('유효성 검사 실패 시(비밀번호 최소 8자 이상이어야 합니다) 에러를 반환해야 합니다', async () => {
    formData.set('password', 'short')

    const result = await signup(prevState, formData)

    expect(result).toEqual({
      error: expect.objectContaining({
        password: expect.arrayContaining(['비밀번호는 최소 8자 이상이어야 합니다']),
      }),
      message: "회원가입 실패",
    })
  })

  it('Supabase 에러 발생 시(이메일 중복) 리다이렉트해야 합니다', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({ error: new Error('Supabase error') })
    vi.mocked(createClient).mockReturnValue({
      auth: {
        signUp: mockSignUp,
      },
    } as any)

    await signup(prevState, formData)

    expect(redirect).toHaveBeenCalledWith('/signup')
  })
})

describe('login', () => {
  let prevState: LoginState
  let formData: FormData

  beforeEach(() => {
    prevState = {
      error: undefined,
      message: undefined,
    }
    formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123!')

    vi.clearAllMocks()
  })

  it('성공적으로 로그인을 수행해야 합니다', async () => {
    const mockSignInWithPassword = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    } as any)

    await login(prevState, formData)

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123!',
    })
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('유효성 검사 실패 시(이메일 형식이 올바르지 않습니다) 에러를 반환해야 합니다', async () => {
    formData.set('email', 'invalid-email')

    const result = await login(prevState, formData)

    expect(result).toEqual({
      error: expect.objectContaining({
        email: expect.arrayContaining(['이메일 형식이 올바르지 않습니다']),
      }),
      message: "로그인 실패"
    })
  })

  it('유효성 검사 실패 시(비밀번호 최소 8자 이상이어야 합니다) 에러를 반환해야 합니다', async () => {
    formData.set('password', 'short')

    const result = await login(prevState, formData)

    expect(result).toEqual({
      error: expect.objectContaining({
        password: expect.arrayContaining(['비밀번호는 최소 8자 이상이어야 합니다']),
      }),
      message: "로그인 실패"
    })
  })

  it('Supabase 에러 발생 시(로그인 실패) 리다이렉트해야 합니다', async () => {
    const mockSignInWithPassword = vi.fn().mockResolvedValue({ error: new Error('Supabase error') })
    vi.mocked(createClient).mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    } as any)

    await login(prevState, formData)

    expect(redirect).toHaveBeenCalledWith('/login')
  })
})

describe('logout', () => {
  it('로그아웃을 성공적으로 수행해야 합니다', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    } as any)

    await logout()

    expect(mockSignOut).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('Supabase 에러 발생 시 콘솔에 로그를 출력해야 합니다', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ error: new Error('Supabase error') })

    vi.mocked(createClient).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    } as any)

    await logout()

    expect(mockSignOut).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/error')
  })
})

describe('getUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('로그인한 사용자의 정보를 반환해야 합니다', async () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    const mockRateData = [{ rate_movie_id: 'movie1' }, { rate_movie_id: 'movie2' }]

    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: mockRateData, error: null }),
      })),
    } as any)

    const result = await getUser()

    expect(result).toEqual({
      user: mockUser,
      movieIds: ['movie1', 'movie2'],
    })
  })

  it('로그인하지 않은 경우 null user와 빈 movieIds를 반환해야 합니다', async () => {
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    } as any)

    const result = await getUser()

    expect(result).toEqual({
      user: null,
      movieIds: [],
    })
  })

  it('Supabase 에러 발생 시 콘솔에 로그를 출력해야 합니다', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockError = new Error('Supabase error')

    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      })),
    } as any)

    await getUser()

    expect(consoleSpy).toHaveBeenCalledWith(mockError)
    consoleSpy.mockRestore()
  })
})      