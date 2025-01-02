import { getProfile } from '../auth/lib/actions/profile'
import ProfileEdit from "./edit/ProfileEditWrapper";
import styles from '@/app/profile/profile.module.css';

export default async function ProfilePage() {
  const profile = await getProfile() || { image_url: '', name: '', id: '' };
  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>프로필 수정</h1>
      <ProfileEdit
        image_url={profile?.image_url}
        name={profile?.name}
        id={profile?.id}
      />
    </div>
  );
}