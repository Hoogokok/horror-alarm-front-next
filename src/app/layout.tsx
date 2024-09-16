import type { Metadata } from "next";
import { Inter, Black_Han_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import { getProfile } from '@/app/auth/lib/actions'
import Image from 'next/image';

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
      <body className={inter.className} style={{ fontFamily: blackHanSans.style.fontFamily }}>
        <div className={styles.container}>
          <nav className={styles.sidebar}>
            <div className={styles.logo}>Spooky Town</div>
            <ul className={styles.menu}>
              <li><Link href="/"><Image src={"/icons/home.svg"} alt="홈" width={30} height={30} className={styles.icon}/>
              <span>홈</span>
              </Link></li>
              <li><Link href="/streaming"><Image src={"/icons/video.svg"} alt="스트리밍" width={30} height={30} className={styles.icon}/>
              <span>스트리밍</span>
              </Link></li>
              <li><Link href="/manga"><Image src={"/icons/manga.svg"} alt="만화" width={30} height={30} className={styles.icon}/>
              <span>만화</span>
              </Link></li>
              <li><Link href="/game"><Image src={"/icons/game.svg"} alt="게임" width={30} height={30} className={styles.icon}/>
              <span>게임</span>
              </Link></li>
              <li><Link href="/search"><Image src={"/icons/search.svg"} alt="찾기" width={30} height={30} className={styles.icon}/>
              <span>찾기</span>
              </Link></li>
              {profile.id ? (
                <li><Link href="/profile"><Image src={profile.image_url} alt="프로필" width={50} height={50} className={styles.profileIcon} unoptimized/>
                <span>프로필</span>
                </Link></li>
              ) : (
                <li><Link href="/login"><Image src={"/icons/login.svg"} alt="로그인" width={30} height={30} className={styles.icon}/>
                <span>로그인</span>
                </Link></li>
              )}
            </ul>
          </nav>
          <header className={styles.mobileHeader}>
          <div className={styles.logo}>Spooky Town</div>
          </header>
          <main className={styles.content}>
            {children}
          </main>
          <nav className={styles.mobileNav}>
            <Link href="/"><Image src={"/icons/home.svg"} alt="홈" width={30} height={30} className={styles.icon}/>
            <span>홈</span>
            </Link>
            <Link href="/streaming"><Image src={"/icons/video.svg"} alt="스트리밍" width={30} height={30} className={styles.icon}/>
            <span>스트리밍</span>
            </Link>
            <Link href="/manga"><Image src={"/icons/manga.svg"} alt="만화" width={30} height={30} className={styles.icon}/>
            <span>만화</span>
            </Link>
            <Link href="/game"><Image src={"/icons/game.svg"} alt="게임" width={30} height={30} className={styles.icon}/>
            <span>게임</span>
            </Link>
            <Link href="/search"><Image src={"/icons/search.svg"} alt="찾기" width={30} height={30} className={styles.icon}/>
            <span>찾기</span>
            </Link>
            {profile.id ? (
              <Link href="/profile"><Image src={profile.image_url} alt="프로필" width={50} height={50} className={styles.profileIcon} unoptimized/>
              <span>프로필</span>
              </Link>
            ) : (
              <Link href="/login"><Image src={profile.image_url} alt="로그인" width={30} height={30} className={styles.icon} />
              <span>로그인</span>
              </Link>
            )}
          </nav>
        </div>
      </body>
    </html>
  );
}
