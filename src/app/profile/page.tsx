import { getProfile } from "@/app/auth/lib/actions";
import ProfileEdit from "./edit/page";
import styles from '@/app/profile/profile.module.css';

export default async function EditProfilePage() {
    const profile = await getProfile()
  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>프로필 수정</h1>
      <ProfileEdit
        initialImageUrl={profile?.image_url}
        initialNickname={profile?.name}
        initialId={profile?.id}
      />
    </div>
  );
}