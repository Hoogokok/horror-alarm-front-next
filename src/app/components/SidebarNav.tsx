import Link from 'next/link';
import Image from 'next/image';
import styles from "../app/layout.module.css";
import ProfileDropdown from './ProfileDropdown';
import { Profile } from '../types/profile';
import { navItems, loginItem } from '@/config/navigation';

interface SidebarNavProps {
  profile: Profile | null;
}
export default function SidebarNav({ profile }: SidebarNavProps) {
    return (
      <ul className={styles.menu}>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <Image src={item.icon} alt={item.alt} width={30} height={30} className={styles.icon}/>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
        {profile && profile.id ? (
          <ProfileDropdown isMobile={false} profile={profile}/>
        ) : (
          <li>
            <Link href={loginItem.href}>
              <Image src={loginItem.icon} alt={loginItem.alt} width={30} height={30} className={styles.icon}/>
              <span>{loginItem.label}</span>
            </Link>
          </li>
        )}
      </ul>
    );
}