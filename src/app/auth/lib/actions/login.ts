'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

const loginSchema = z.object({
    email: z.string().email("이메일 형식이 올바르지 않습니다"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다")
        .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "비밀번호는 최소 하나의 특수문자를 포함해야 합니다"),
})

export type LoginState = {
    error?: {
        email?: string[]
        password?: string[]
    }
    message?: string
}

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
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return {
            error: {},
            message: "이메일 또는 비밀번호가 일치하지 않습니다"
        }
    }

    const redirectTo = formData.get('redirectTo') as string || '/'

    revalidatePath('/', 'layout')
    redirect(redirectTo)
}

export async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
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