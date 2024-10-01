import Link from 'next/link';
import Image from 'next/image';
import styles from "../app/layout.module.css";
import ProfileDropdown from './ProfileDropDown';
import { Profile } from '../types/profile';

interface SidebarNavProps {
  profile: Profile | null;
}

export default function SidebarNav({ profile }: SidebarNavProps) {
  return (
    <ul className={styles.menu}>
      <li><Link href="/"><Image src={"/icons/home.svg"} alt="홈" width={30} height={30} className={styles.icon}/>
      <span>홈</span>
      </Link></li>
      <li><Link href="/streaming"><Image src={"/icons/video.svg"} alt="스트리밍" width={30} height={30} className={styles.icon}/>
      <span>스트리밍</span>
      </Link></li>
      <li><Link href="/inDevelopment"><Image src={"/icons/manga.svg"} alt="만화" width={30} height={30} className={styles.icon}/>
      <span>만화</span>
      </Link></li>
      <li><Link href="/inDevelopment"><Image src={"/icons/game.svg"} alt="게임" width={30} height={30} className={styles.icon}/>
      <span>게임</span>
      </Link></li>
      <li><Link href="/magazine"><Image src={"/icons/search.svg"} alt="찾기" width={30} height={30} className={styles.icon}/>
      <span>잡지 기사</span>
      </Link></li>
      {profile && profile.id ? (
        <ProfileDropdown isMobile={false} profile={profile}/>
      ) : (
        <li><Link href="/login"><Image src={"/icons/login.svg"} alt="로그인" width={30} height={30} className={styles.icon}/>
        <span>로그인</span>
        </Link></li>
      )}
    </ul>
  );
}