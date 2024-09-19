'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../layout.module.css';
import { logout, Profile } from '@/app/auth/lib/actions';
import localFont from 'next/font/local';

const doHyeon = localFont({
  src: '../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

interface ProfileDropdownProps {
  profile: Profile;
  isMobile: boolean;
}

export default function ProfileDropdown({ profile, isMobile }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const dropdownClass = isMobile ? styles.mobileProfileDropdown : styles.profileDropdown;
  const menuClass = isMobile ? styles.mobileDropdownMenu : styles.dropdownMenu;
  const buttonClass = isMobile ? `${styles.profileButton} ${styles.mobileProfileButton}` : styles.profileButton;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <li className={dropdownClass}>
      <button className={buttonClass} onClick={toggleDropdown}>
        <Image src={profile.image_url} alt="프로필" width={30} height={30} className={styles.profileIcon} unoptimized/>
        <span className={doHyeon.className}>프로필</span>
      </button>
      {isOpen && (
        <ul className={menuClass}>
          <li><Link href="/profile" onClick={() => setIsOpen(false)}>프로필 편집</Link></li>
          <li><button onClick={handleLogout}>로그아웃</button></li>
        </ul>
      )}
    </li>
  );
}
