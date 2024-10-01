import { getProfile } from '@/app/auth/lib/actions';
import type { Metadata } from "next";
import { Black_Han_Sans, Inter } from "next/font/google";
import Image from 'next/image';
import Link from "next/link";
import ProfileDropdown from './components/ProfileDropDown';
import SidebarNav from './components/SidebarNav';
import MobileNav from './components/MobileNav';
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
          <MobileNav profile={profile} />
        </div>
      </body>
    </html>
  );
}
