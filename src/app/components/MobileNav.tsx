import Link from 'next/link';
import Image from 'next/image';
import styles from "@/app/layout.module.css";
import ProfileDropdown from './ProfileDropdown';
import { Profile } from '@/\btypes/profile';
import { navItems, loginItem } from '@/config/navigation';
interface MobileNavProps {
  profile: Profile | null;
}

export default function MobileNav({ profile }: MobileNavProps) {
    return (
      <nav className={styles.mobileNav}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Image src={item.icon} alt={item.alt} width={30} height={30} className={styles.icon}/>
          </Link>
        ))}
        {profile && profile.id ? (
          <ProfileDropdown isMobile={true} profile={profile}/>
        ) : (
          <Link href={loginItem.href}>
            <Image src={loginItem.icon} alt={loginItem.alt} width={30} height={30} className={styles.icon}/>
          </Link>
        )}
      </nav>
    );
  }
