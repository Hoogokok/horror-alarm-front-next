'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';
import { createClient } from '@/app/utils/supabase/server'

const loginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다").regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "비밀번호는 최소 하나의 특수문자를 포함해야 합니다"),})

const signupSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다").regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "비밀번호는 최소 하나의 특수문자를 포함해야 합니다"),
  name: z.string().min(1, "이름은 최소 1자 이상이어야 합니다"),
})

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
    error?: {
        email?: string[]
        password?: string[]
        name?: string[]
    }
    message?: string
};

export async function signup(prevState: SignupState, formData: FormData) {
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
    redirect('/signup')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


export async function logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        redirect('/error')
    }
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function getUser() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
   
    //로그인 하지 않았을 때
    if (!data.user) {
        return {
            user: null,
            movieIds: [],
        }
    }
    const { data: rateData, error: rateError } = await supabase.from('rate').select('rate_movie_id')
    if (rateError) {
        console.log(rateError)
    }
    let movieIds: string[] = []
    if (rateData) {
        movieIds = rateData.map((rate: any) => rate.rate_movie_id)
    }
    return {
        user: data.user,
        movieIds: movieIds,
    }
}

export async function getProfile() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
        console.log(error)
    }
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user?.id)
    if (profileError) {
        console.log(profileError)
    }
    return profileData?.[0]
}