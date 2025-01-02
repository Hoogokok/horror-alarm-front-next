'use client';
import { useActionState } from 'react';
import { 
  updateProfile, 
  type UploadProfileImageState 
} from '@/app/auth/lib/actions/profile'
import styles from '@/app/profile/profile.module.css';
import { useState, useRef, useCallback} from 'react';
import localFont from 'next/font/local';
import ProfileImageSection from '../components/ProfileImageSection';
import PasswordSection from '../components/PasswordSection';
import ProfileInfoSection from '../components/ProfileInfoSection';

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
  const initialState: UploadProfileImageState = {
    error: '',
    message: '',
    imageUrl: image_url || '',
    name: name || '',
    isPending: false,
    id: id || '',
  }
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpdate = (file: File | null) => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formAction(formData);
    }
  };

  const handleSubmit = useCallback((formData: FormData) => {
    if (!previewImage && state.imageUrl) {
      formData.set('image', state.imageUrl);
    }
    formAction(formData);
  }, [formAction, previewImage, state.imageUrl]);

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