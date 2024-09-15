import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import { getUser } from '@/app/auth/lib/actions'
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spooky Town",
  description: "공포 콘텐츠의 모든 것",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getUser()
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className={styles.container}>
          <nav className={styles.sidebar}>
            <div className={styles.logo}>Spooky Town</div>
            <ul className={styles.menu}>
              <li><Link href="/"><Image src={"/icons/home.svg"} alt="홈" width={24} height={24} className={styles.icon}/>
              <span>홈</span>
              </Link></li>
              <li><Link href="/streaming"><span className={styles.icon}>🎬</span>스트리밍</Link></li>
              <li><Link href="/streaming"><span className={styles.icon}>📺</span>웹툰</Link></li>
              <li><Link href="/streaming"><span className={styles.icon}>📚</span>책</Link></li>
              <li><Link href="/streaming"><span className={styles.icon}>🔍</span>찾기</Link></li>
              {data.user ? (
                <li><Link href="/profile"><span className={styles.icon}>👤</span>프로필</Link></li>
              ) : (
                <li><Link href="/login"><span className={styles.icon}>🔑</span>로그인</Link></li>
              )}
            </ul>
          </nav>
          <main className={styles.content}>
            {children}
          </main>
          <nav className={styles.mobileNav}>
            <Link href="/"><Image src={"/icons/home.svg"} alt="홈" width={24} height={24} className={styles.icon}/>
            <span>홈</span>
            </Link>
            <Link href="/streaming"><span className={styles.icon}></span>스트리밍</Link>
            <Link href="/streaming"><span className={styles.icon}></span>웹툰</Link>
            <Link href="/streaming"><span className={styles.icon}></span>책</Link>
            <Link href="/search"><span className={styles.icon}></span>찾기</Link>
            {data.user ? (
              <Link href="/profile"><span className={styles.icon}></span>프로필</Link>
            ) : (
              <Link href="/login"><span className={styles.icon}></span>로그인</Link>
            )}
          </nav>
        </div>
      </body>
    </html>
  );
}
