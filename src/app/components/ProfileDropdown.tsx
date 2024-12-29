'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/layout.module.css';
import { Profile } from '@/types/profile';
import localFont from 'next/font/local';
import { profileMenuItems } from '@/config/profileMenu';

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

  const handleMenuItemClick = async (action: (() => Promise<void>) | null) => {
    setIsOpen(false);
    if (action) {
      try {
        await action();
      } catch (error) {
        console.error('로그아웃 실행 중 오류 발생:', error);
      }
    }
  };

  return (
    <li className={dropdownClass}>
      <button className={buttonClass} onClick={toggleDropdown}>
        <Image src={profile.image_url} alt="프로필" width={30} height={30} className={styles.profileIcon} unoptimized />
        <span className={doHyeon.className}>프로필</span>
      </button>
      {isOpen && (
        <ul className={menuClass}>
          {profileMenuItems.map((item) => (
            <li key={item.href}>
              {item.action ? (
                <button onClick={() => handleMenuItemClick(item.action)}>{item.label}</button>
              ) : (
                <Link href={item.href} onClick={() => handleMenuItemClick(null)}>{item.label}</Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
