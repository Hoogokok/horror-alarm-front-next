import { logout } from '@/app/auth/lib/actions/login'

export const profileMenuItems = [
    { href: "/profile", label: "프로필 편집", action: null },
    { href: "#", label: "로그아웃", action: logout },
  ];