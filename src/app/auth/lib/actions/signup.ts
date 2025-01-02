'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

const signupSchema = z.object({
    email: z.string().email("이메일 형식이 올바르지 않습니다"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다")
        .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "비밀번호는 최소 하나의 특수문자를 포함해야 합니다"),
    name: z.string().min(1, "이름은 최소 1자 이상이어야 합니다"),
})

export type SignupState = {
    error: {
        email?: string[]
        password?: string[]
        name?: string[]
    }
    message: string
}

export async function signup(prevState: SignupState, formData: FormData) {
    const supabase = createClient()

    const validation = signupSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
    })

    if (!validation.success) {
        return {
            error: validation.error.flatten().fieldErrors,
            message: "회원가입 실패"
        }
    }

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
                email: ["이미 가입된 이메일입니다"],
            },
            message: "회원가입 실패"
        }
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=' + encodeURIComponent('이메일 인증을 완료해주세요'))
} 