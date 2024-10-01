import { vi, describe, it, expect, beforeEach } from 'vitest'
import { login, LoginState, signup, SignupState, getUser, logout, getProfile, updateProfile, UploadProfileImageState } from '@/app/auth/lib/actions'
import { createClient } from '@/utils/supabase/server'
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
    from: vi.fn((table) => ({
      select: vi.fn().mockResolvedValue(
        table === 'rate' 
          ? { data: [], error: null }
          : { data: [], error: null }
      ),
      eq: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
      update: vi.fn().mockReturnValue({
        data: [],
        error: null,
      }),
    })),
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(),
        upload: vi.fn(),
      })),
    },
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
      error: {
        email: undefined as string[] | undefined,
        password: undefined as string[] | undefined,
        name: undefined as string[] | undefined,
      },
      message: '',
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

    const result = await signup(prevState, formData)

    expect(result).toEqual({
      error: expect.objectContaining({
        email: expect.arrayContaining([formData.get('email') as string]),
      }),
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    })   
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
    const mockReviewData = [{ review_movie_id: 'movie1' }, { review_movie_id: 'movie2' }]
    
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn((table) => ({
        select: vi.fn().mockResolvedValue(
          table === 'rate' 
            ? { data: mockRateData, error: null }
            : { data: mockReviewData, error: null }
        )
      })),
    } as any)

    const result = await getUser()

    expect(result).toEqual({
      user: mockUser,
      rate_movieIds: ['movie1', 'movie2'],
      review_movieIds: ['movie1', 'movie2'],
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
      rate_movieIds: [],
      review_movieIds: [],
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

describe('getProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('사용자 프로필 정보를 반환해야 합니다', async () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    const mockProfileData = [{ id: '123', name: 'Test User' }]
    const mockPublicUrl = 'https://example.com/profile-image.jpg'

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockProfileData, error: null }),
      })),
      storage: {
        from: vi.fn(() => ({
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } }),
        })),
      },
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase as any)

    const result = await getProfile()

    expect(result).toEqual({
      ...mockProfileData[0],
      image_url: mockPublicUrl,
    })
  })

  it('사용자 정보 조회 중 에러 발생 시 null을 반환합니다', async () => {
    const mockError = new Error('User fetch error')
    const mockUser = { id: '123', email: 'test@example.com' }
    const mockProfileData = [{ id: '', name: 'Test User' }]

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: mockError }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockProfileData, error: null }),
      })),
      storage: {
        from: vi.fn(() => ({
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: '' } }),
        })),
      },
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase as any)

    const result = await getProfile()

    expect(result).toEqual(null)
  })

  it('프로필 정보 조회 중 에러 발생 시 콘솔에 로그를 출력하고 null을 반환합니다', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockUser = { id: '123', email: 'test@example.com' }
    const mockError = new Error('Profile fetch error')
    const mockPublicUrl = "error"

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      })),
      storage: {
        from: vi.fn(() => ({
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } }),
        })),
      },
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase as any)

    const result = await getProfile()

    expect(consoleSpy).toHaveBeenCalledWith(mockError)
    expect(result).toEqual(null)
    consoleSpy.mockRestore()
  })
})

describe('updateProfile', () => {
    let mockSupabase: any
    let prevState: UploadProfileImageState
    let formData: FormData

    beforeEach(() => {
        vi.clearAllMocks()
        mockSupabase = {
          from: vi.fn(() => ({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
            select: vi.fn().mockResolvedValue({ data: {}, error: null }),
          })),
          storage: {
            from: vi.fn(() => ({
              upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
            })),
          },
        }
        vi.mocked(createClient).mockReturnValue(mockSupabase)
    
        prevState = {
          error: undefined,
          message: undefined,
          imageUrl: 'old-image-url',
          name: 'Old Name',
          isPending: false,
          id: '123',
        }
    
        formData = new FormData()
        formData.append('image', new File(['test'], 'test.jpeg', { type: 'image/jpeg' }))
        formData.append('name', 'New Name')
        formData.append('id', '123')
      })

      it('성공적으로 프로필 이미지를 업로드해야 합니다', async () => {
        const result = await updateProfile(prevState, formData)
        expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
        expect(mockSupabase.storage.from).toHaveBeenCalledWith('profile-image')
        expect(revalidatePath).toHaveBeenCalledWith('/profile', 'page')
        expect(redirect).toHaveBeenCalledWith('/profile')
      })

      it('별명만 변경되어야 합니다', async () => {
        formData.set('name', 'New Name')
        const result = await updateProfile(prevState, formData)
      
        expect(revalidatePath).toHaveBeenCalledWith('/profile', 'page')
        expect(redirect).toHaveBeenCalledWith('/profile')
      })

      it('이미지만 변경되어야 합니다', async () => {
        formData.set('image', new File([''], 'test.jpeg', { type: 'image/jpeg' }))
        const result = await updateProfile(prevState, formData)
        expect(revalidatePath).toHaveBeenCalledWith('/profile', 'page')
        expect(redirect).toHaveBeenCalledWith('/profile')
      })

      it('유효성 검사 실패 시(JPEG 파일만 업로드 가능합니다) 에러를 반환해야 합니다', async () => {
        formData.set('image', new File(['test'], 'test.png', { type: 'image/png' }));
        const result = await updateProfile(prevState, formData);
        expect(result).toEqual({
            error: expect.stringContaining('JPEG 파일만 업로드 가능합니다'),
            message: "JPEG 파일만 업로드 가능합니다",
            isPending: false,
            name: prevState.name,
            imageUrl: prevState.imageUrl,
            id: prevState.id,
        })
    })

    it('유효성 검사 실패 시(이름은 최소 2자 이상이어야 합니다) 에러를 반환해야 합니다', async () => {
        formData.set('name', '')
      const result = await updateProfile(prevState, formData)
        expect(result).toEqual({
            error: expect.stringContaining('이름은 최소 2자 이상이어야 합니다'),
            message: "이름은 최소 2자 이상이어야 합니다",
            isPending: false,
            name: prevState.name,
            imageUrl: prevState.imageUrl,
            id: prevState.id,
        })
    })

    it('유효성 검사 실패 시(이름은 최대 20자 이하이어야 합니다) 에러를 반환해야 합니다', async () => {
        formData.set('name', 'a'.repeat(21))
      const result = await updateProfile(prevState, formData)
        expect(result).toEqual({
            error: expect.stringContaining('이름은 최대 20자 이하이어야 합니다'),
            message: "이름은 최대 20자 이하이어야 합니다",
            isPending: false,
            name: prevState.name,
            imageUrl: prevState.imageUrl,
            id: prevState.id,
        })
    })

    it('Supabase storage 에러 발생 시 콘솔에 로그를 출력합니다. 별명 변경은 성공하지만 이미지 업로드는 실패합니다.', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        const mockFormData = new FormData();
        mockFormData.append('image', new File(['test'], 'test.jpeg', { type: 'image/jpeg' }));
        mockFormData.append('name', '테스트 이름');
        mockFormData.append('id', 'test-id');
    
        const prevState = {
          name: '이전 이름',
          imageUrl: '이전 이미지 URL',
          id: 'test-id',
        };
    
        mockSupabase.from.mockReturnValue({
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
        });
    
        mockSupabase.storage.from.mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: null, error: { message: '업로드 실패' } }),
        });
    
      const result = await updateProfile(prevState, mockFormData);
    
        expect(result).toEqual({
          error: '업로드 실패',
          message: '프로필 이미지 업로드 실패',
          isPending: false,
          name: '테스트 이름',
          imageUrl: '이전 이미지 URL',
          id: 'test-id',
        });
        consoleSpy.mockRestore()
    });
})       
