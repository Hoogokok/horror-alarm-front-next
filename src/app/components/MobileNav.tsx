import Link from 'next/link';
import Image from 'next/image';
import styles from "@/app/layout.module.css";
import ProfileDropdown from './ProfileDropDown';
import { Profile } from '../types/profile';

interface MobileNavProps {
  profile: Profile | null;
}

export default function MobileNav({ profile }: MobileNavProps) {
  return (
    <nav className={styles.mobileNav}>
      <Link href="/"><Image src={"/icons/home.svg"} alt="홈" width={30} height={30} className={styles.icon}/></Link>
      <Link href="/streaming"><Image src={"/icons/video.svg"} alt="스트리밍" width={30} height={30} className={styles.icon}/></Link>
      <Link href="/inDevelopment"><Image src={"/icons/manga.svg"} alt="만화" width={30} height={30} className={styles.icon}/></Link>
      <Link href="/inDevelopment"><Image src={"/icons/game.svg"} alt="게임" width={30} height={30} className={styles.icon}/></Link>
      <Link href="/magazine"><Image src={"/icons/search.svg"} alt="찾기" width={30} height={30} className={styles.icon}/></Link>
      {profile && profile.id ? (
        <ProfileDropdown isMobile={true} profile={profile}/>
      ) : (
        <Link href="/login"><Image src={"/icons/login.svg"} alt="로그인" width={30} height={30} className={styles.icon}/></Link>
      )}
    </nav>
  );
}
