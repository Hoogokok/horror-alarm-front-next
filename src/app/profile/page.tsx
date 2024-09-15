import { logout } from "../auth/lib/actions";
import Image from 'next/image';
import Link from 'next/link';
import styles from "./profile.module.css"
import { getProfile } from "../auth/lib/actions";

export default async function Page() {
  const profile = await getProfile()
  const profileImage = profile?.image_url
  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>프로필 수정</h1>
      <div className={styles.profileContent}>
        <div className={styles.imageSection}>
          {profileImage ? (
            <Image src={profileImage} alt="프로필 이미지" width={200} height={200} className={styles.profileImage} />
          ) : (
            <div className={styles.profileImagePlaceholder}>
              {profile?.name ? profile.name[0].toUpperCase() : '?'}
            </div>
          )}
          <button className={styles.changeImageButton}>이미지 변경</button>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">이름</label>
            <input type="text" id="name" value={profile.name} className={styles.input} />
            <p className={styles.inputDescription}>이름은 최소 2자, 최대 20자까지 입력이 가능해요<br />수정한 정보는 왓챠의 다른 서비스에도 동일하게 표시돼요</p>
          </div>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton}>취소</button>
        <button className={styles.saveButton}>변경 저장</button>
      </div>
    </div>
  );
}