'use client';
import styles from '@/app/profile/profile.module.css';
import localFont from 'next/font/local';
import ProfileImageSection from '../components/ProfileImageSection';
import PasswordSection from '../components/PasswordSection';
import ProfileInfoSection from '../components/ProfileInfoSection';
import { useProfileForm } from '../hooks/useProfileForm';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

interface ProfileEditProps {
  name: string;
  image_url: string;
  id: string;
}

export default function ProfileEdit({ name, image_url, id }: ProfileEditProps) {
  const { state, handleImageUpdate, handleSubmit } = useProfileForm({
    name,
    image_url,
    id,
  });

  return (
    <div className={`${styles.profileContainer} ${doHyeon.className}`}>
      <div className={styles.profileContent}>
        <form className={styles.form} action={handleSubmit}>
          <div className={styles.profileLayout}>
            <ProfileImageSection
              imageUrl={state.imageUrl}
              name={state.name}
              onImageChange={handleImageUpdate}
            />
            <ProfileInfoSection
              name={state.name}
              id={state.id}
              isPending={state.isPending}
            />
          </div>
        </form>

        <PasswordSection />

        {state?.message && <p className={styles.message}>{state.message}</p>}
      </div>
    </div>
  );
}