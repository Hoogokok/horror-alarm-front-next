import { logout } from "../auth/lib/actions";
import Image from 'next/image';
import Link from 'next/link';
import styles from "./profile.module.css"
import { getProfile } from "../auth/lib/actions";

export default async function Page() {
  const profile = await getProfile()
  const profileImage = null;

  return (
    <div className={styles.profileContainer}>
      {profileImage ? (
        <Image src={profileImage} alt="프로필 이미지" width={200} height={200} className={styles.profileImage} />
      ) : (
        <div className={styles.profileImagePlaceholder}>
          ?
        </div>
      )}
      <div className={styles.profileNickname}>{profile.name}</div>
      <Link href="/edit-profile" className={styles.profileEditLink}>
        프로필 변경
      </Link>
      <form action={logout}>
        <button type="submit" className={styles.logoutButton}>로그아웃</button>
      </form>
    </div>
  );
}