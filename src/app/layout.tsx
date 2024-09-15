import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import { getUser } from '@/app/auth/lib/actions'

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
              <li><Link href="/"><span className={styles.icon}>🏠</span>홈</Link></li>
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
        </div>
      </body>
    </html>
  );
}
