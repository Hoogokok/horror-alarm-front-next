'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server'
import { Profile } from '@/types/profile';
import { UserWithMovieIds } from '@/types/user';

const loginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다").regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "비밀번호는 최소 하나의 특수문자를 포함해야 합니다"),})

const signupSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다").regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "비밀번호는 최소 하나의 특수문자를 포함해야 합니다"),
  name: z.string().min(1, "이름은 최소 1자 이상이어야 합니다"),
})

// 비밀번호 변경을 위한 validation schema 추가
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
      "비밀번호는 최소 하나의 특수문자를 포함해야 합니다"
    ),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "새 비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

export type LoginState = {
    error?: {
        email?: string[]
        password?: string[]
    }
    message?: string

};

export async function login(prevState: LoginState, formData: FormData) {
  const supabase = createClient()

  const validation = loginSchema.safeParse({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (!validation.success) {
    return {
      error: validation.error.flatten().fieldErrors,
      message: "로그인 실패"
    }
  }
  const { email, password } = validation.data
  const data = {
    email,
    password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export type SignupState = {
    error: {
        email?: string[]
        password?: string[]
        name?: string[]
    }
    message: string
};

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
    const validation = signupSchema.safeParse({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
    })

    if (!validation.success) {
        return {
            error: validation.error.flatten().fieldErrors,
            message: "회원가입 실패"
        }
    }
    const supabase = createClient()
    const { email, password, name } = validation.data

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            name,
        },
    },
  })

  if (error) {
    return {
      error: {
        email: [email], // 배열로 변경
        password: [password], // 배열로 변경
        name: [name], // 배열로 변경
      },
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        redirect('/error')
    }
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function getUser(): Promise<UserWithMovieIds> {
    const supabase = createClient()
    try {
        const { data, error } = await supabase.auth.getUser()
        //로그인 하지 않았을 때
        if (!data.user) {
            return {
                user: null,
                rate_movieIds: [],
                review_movieIds: [],
            }
        }
      const { data: rateData, error: rateError } = await supabase
        .from('rate')
        .select('rate_movie_id')
        .eq('rate_user_id', data.user.id)  // 현재 사용자의 평점만 필터링

      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('review_movie_id')
        .eq('review_user_id', data.user.id)

        if (rateError) {
            console.log(rateError)
        }
        if (reviewError) {
            console.log(reviewError)
        }
        let movieIds: number[] = []
        let reviewIds: number[] = []
        if (rateData) {
            movieIds = rateData.map((rate: any) => rate.rate_movie_id)
        }
        if (reviewData) {
            reviewIds = reviewData.map((review: any) => review.review_movie_id)
        }
        return {
            user: data.user,
            rate_movieIds: movieIds,
            review_movieIds: reviewIds,
        }
    } catch (error) {
        console.error('사용자 정보 조회 중 오류 발생:', error)
        return { user: null, rate_movieIds: [], review_movieIds: [] }
    }
}

export async function getProfile() : Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
      return null
  }
  const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user?.id)

  if (profileError) {
      console.log(profileError)
      return null
  }
  const fileName = `user-${profileData?.[0].id}.jpeg`
  const filePath = `${profileData?.[0].id}/${fileName}`
  const { data: profileImageData } = await supabase.storage.from('profile-image').getPublicUrl(filePath)
  const imageUrl = `${profileImageData.publicUrl}`
  return {
      name: profileData?.[0].name,
      image_url: imageUrl,
      id: profileData?.[0].id,
  }
}
const uploadProfileImageSchema = z.object({
    image: z.union([
        z.custom<File>((val) => val instanceof File, "파일이어야 합니다"),
        z.string().url("유효한 이미지 URL이어야 합니다"),
    ]).optional()
    .refine(
        (val) => {
            if (val instanceof File) {
                return ['image/jpeg'].includes(val.type);
            }
            return true; // URL인 경우 이미 검증되었으므로 true 반환
        },
        {
            message: "JPEG 파일만 업로드 가능합니다",
        }
    ),
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다").max(20, "이름은 최대 20자 이하이어야 합니다").optional(),
    id: z.string().min(1, "id는 최소 1자 이상이어야 합니다"),
})
export type UploadProfileImageState = {
    error?: string
    message?: string
    imageUrl?: string
    name?: string
    isPending?: boolean
    id: string
}

export async function updateProfile(prevState: UploadProfileImageState, formData: FormData) {
    const supabase = createClient()
    const validation = uploadProfileImageSchema.safeParse({
        image: formData.get('image') as File,
        name: formData.get('name') as string,
        id: formData.get('id') as string,
    })
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "알 수 없는 오류가 발생했습니다"
      return {
            error: validation.error.message,
            message: errorMessage,
            isPending: false,
            name: prevState.name,
            imageUrl: prevState.imageUrl,
            id: prevState.id,
        }
    }
    const { image, name, id } = validation.data
    let updatedName = prevState.name
    let updatedImageUrl = prevState.imageUrl

    //이름 변경
    if(name && name !== prevState.name) {
    const {error: userError } = await supabase.from('profiles').update({
        name: name,
    }).eq('id', id)
    if (userError) {
        console.log(userError)
        return {
            error: userError.message,
            message: "별명 변경 실패",
            isPending: false,
            name: prevState.name,
            imageUrl: prevState.imageUrl,
            id: prevState.id,
        }
    }
        updatedName = name
    }
    //이미지 변경
    if (image) {
        if (image instanceof File) {
          // 새 이미지 파일 업로드
          const fileName = `user-${id}.jpeg`
          const filePath = `${id}/${fileName}`
          const { data, error } = await supabase.storage.from('profile-image').upload(filePath, image, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          })
          if (error) {
            console.log(error)
            return {
              error: error.message,
              message: "프로필 이미지 업로드 실패",
              isPending: false,
              name: updatedName,
              imageUrl: prevState.imageUrl,
              id: prevState.id,
            }
          }
          updatedImageUrl = data.path
        } else if (typeof image === 'string' && image !== prevState.imageUrl) {
          // 이미지 URL이 변경된 경우 (예: 이미지 삭제 또는 다른 URL로 변경)
          updatedImageUrl = image
          // 필요한 경우 여기에 프로필 이미지 URL 업데이트 로직 추가
          const { error: updateError } = await supabase.from('profiles').update({ image_url: updatedImageUrl }).eq('id', id)
          if (updateError) {
            console.log(updateError)
            return {
              error: updateError.message,
              message: "프로필 이미지 URL 업데이트 실패",
              isPending: false,
              name: updatedName,
              imageUrl: prevState.imageUrl,
              id: prevState.id,
            }
          }
        }
      }
    
    revalidatePath('/profile', 'page')
    redirect('/profile')
}

export async function refreshSession() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.refreshSession()
  if (error) {
    console.error('세션 갱신 오류:', error)
    return false
  }
  return true
}

export type PasswordUpdateState = {
  error?: {
    currentPassword?: string[]
    newPassword?: string[]
    confirmPassword?: string[]
  }
  message?: string
  isPending?: boolean
}

export async function updatePassword(prevState: PasswordUpdateState, formData: FormData) {
  const supabase = createClient()

  // 현재 사용자 확인
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return {
      error: {
        currentPassword: ["사용자 인증에 실패했습니다"],
      },
      message: "로그인이 필요합니다",
      isPending: false,
    }
  }

  const validation = passwordUpdateSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validation.success) {
    return {
      error: validation.error.flatten().fieldErrors,
      message: "입력 정보를 확인해주세요",
      isPending: false,
    }
  }

  const { currentPassword, newPassword } = validation.data

  // 현재 비밀번호로 로그인 시도하여 검증
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })

  if (verifyError) {
    return {
      error: {
        currentPassword: ["현재 비밀번호가 일치하지 않습니다"],
      },
      message: "현재 비밀번호를 확인해주세요",
      isPending: false,
    }
  }

  // 새 비밀번호로 업데이트
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return {
      error: {
        newPassword: ["비밀번호 변경에 실패했습니다"],
      },
      message: "잠시 후 다시 시도해주세요",
      isPending: false,
    }
  }

  revalidatePath('/profile')
  return {
    message: "비밀번호가 성공적으로 변경되었습니다",
    isPending: false,
  }
}