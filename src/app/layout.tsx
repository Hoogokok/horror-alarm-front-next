import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./page.module.css";
import { getUser } from '@/app/auth/lib/actions'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getUser()
  return (
    <html>
      <body className={inter.className}>
        <div className={styles.header}>
          <label className={styles.hamb}>
            <span className={styles.hambline}>
              <input className={styles.sidemenuToggle} type="checkbox" id='sidemenu-toggle' />
            </span>
          </label>
          <nav className={styles.sidenav}>
            <ul className={styles.sidelist}>
              <li className={styles.sidemenuItem}>
                <Link href="/">
                  홈
                </Link>
              </li>
              <li className={styles.sidemenuItem}>
                <Link href="/streaming">
                  스트리밍
                </Link>
              </li>
              <li className={styles.sidemenuItem}>
                <Link href="/top-rated">
                  인기 영화
                </Link>
              </li>
              {
                data.user ? (
                  <li className={styles.sidemenuItem}>
                    <Link href="/profile">
                      프로필
                    </Link>
                  </li>
                ) : (
                  <li className={styles.sidemenuItem}>
                    <Link href="/login">
                      로그인 / 회원가입
                    </Link>
                  </li>
                )
              }
            </ul>
          </nav>
        </div>
        <nav className={styles.navigation}>
          <ul className={styles.list}>
            <li className={styles.menu}>
              <Link href="/">
                홈
              </Link>
            </li>
            <li className={styles.menu}>
              <Link href="/streaming">
                스트리밍
              </Link>
            </li>
            <li className={styles.menu}>
              <Link href="/top-rated">
                인기 영화
              </Link>
            </li>
           {data.user ? (
              <li className={styles.menu}>
                <Link href="/profile">
                  프로필
                </Link>
              </li>
            ) : (
              <li className={styles.menu}>
                <Link href="/login">
                  로그인 / 회원가입
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
