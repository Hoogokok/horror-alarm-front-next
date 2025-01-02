'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

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
})

export type PasswordUpdateState = {
    error: {
        currentPassword?: string[]
        newPassword?: string[]
        confirmPassword?: string[]
    }
    message: string
    isPending: boolean
}

export async function updatePassword(prevState: PasswordUpdateState, formData: FormData): Promise<PasswordUpdateState> {
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

    // 모든 세션 종료 및 로그아웃
    await supabase.auth.signOut({ scope: 'global' })

    // 전체 레이아웃 캐시 무효화 후 로그인 페이지로 리다이렉트
    revalidatePath('/', 'layout')
    redirect('/login?message=' + encodeURIComponent("비밀번호가 변경되었습니다. 새 비밀번호로 다시 로그인해주세요."))
} 