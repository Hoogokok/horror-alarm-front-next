import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// 보호된 경로 정의
const protectedPaths = ['/profile']

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedPath = protectedPaths.some(protectedPath =>
        path.startsWith(protectedPath)
    )

    // 세션 업데이트 및 확인
    const response = await updateSession(request)

    // 실제 쿠키 이름 찾기
    const authToken = request.cookies.getAll()
        .find(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'))

    if (isProtectedPath && !authToken) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectTo', path)
        return NextResponse.redirect(redirectUrl)
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
} 