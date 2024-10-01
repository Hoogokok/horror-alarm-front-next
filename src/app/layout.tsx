import { getProfile } from '@/app/auth/lib/actions';
import type { Metadata } from "next";
import { Black_Han_Sans, Inter } from "next/font/google";
import Image from 'next/image';
import Link from "next/link";
import ProfileDropdown from './components/ProfileDropDown';
import SidebarNav from './components/SidebarNav';
import "./globals.css";
import styles from "./layout.module.css";


const inter = Inter({ subsets: ["latin"] });
const blackHanSans = Black_Han_Sans({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Spooky Town",
  description: "공포 콘텐츠의 모든 것",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const profile = await getProfile()

  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className={styles.container}>
          <nav className={styles.sidebar}>
            <div className={styles.logo} style={blackHanSans.style}>Spooky Town</div>
            <SidebarNav profile={profile} />
          </nav>
          <header className={styles.mobileHeader}>
          <div className={styles.logo} style={blackHanSans.style}>Spooky Town</div>
          </header>
          <main className={styles.content}>
            {children}
          </main>
          <nav className={styles.mobileNav}>
            <Link href="/"><Image src={"/icons/home.svg"} alt="홈" width={30} height={30} className={styles.icon}/><span>홈</span></Link>
            <Link href="/streaming"><Image src={"/icons/video.svg"} alt="스트리밍" width={30} height={30} className={styles.icon}/><span>스트리밍</span></Link>
            <Link href="/inDevelopment"><Image src={"/icons/manga.svg"} alt="만화" width={30} height={30} className={styles.icon}/><span>만화</span></Link>
            <Link href="/inDevelopment"><Image src={"/icons/game.svg"} alt="게임" width={30} height={30} className={styles.icon}/><span>게임</span></Link>
            <Link href="/magazine"><Image src={"/icons/search.svg"} alt="찾기" width={30} height={30} className={styles.icon}/><span>잡지 기사</span></Link>
            {profile && profile.id ? (
              <ProfileDropdown isMobile={true} profile={profile}/>
            ) : (
              <Link href="/login"><Image src={"/icons/login.svg"} alt="로그인" width={30} height={30} className={styles.icon} /><span>로그인</span></Link>
            )}
          </nav>
        </div>
      </body>
    </html>
  );
}
