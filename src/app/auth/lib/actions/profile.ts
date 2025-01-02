'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { Profile } from '@/types/profile'
import { redirect } from 'next/navigation'
import { z } from 'zod'

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


export async function getProfile(): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
        return null
    }

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)

    if (profileError) {
        console.log(profileError)
        return null
    }

    const fileName = `user-${profileData?.[0].id}.jpeg`
    const filePath = `${profileData?.[0].id}/${fileName}`
    const { data: profileImageData } = await supabase.storage
        .from('profile-image')
        .getPublicUrl(filePath)

    const imageUrl = `${profileImageData.publicUrl}`
    return {
        name: profileData?.[0].name,
        image_url: imageUrl,
        id: profileData?.[0].id,
    }
} 