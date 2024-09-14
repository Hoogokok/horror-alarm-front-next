'use client';
import Image from 'next/image';
import { useActionState } from 'react';
import { uploadProfileImage, UploadProfileImageState } from '@/app/auth/lib/actions';
import styles from '../../profile.module.css';

interface ProfileEditProps {
  initialNickname: string;
  initialImageUrl: string;
  initialId: string;
}

export default function ProfileEdit({ initialNickname, initialImageUrl, initialId }: ProfileEditProps) {
 
  const initialState: UploadProfileImageState = {
    error: '',
    message: '',
    imageUrl: initialImageUrl || '',
    name: initialNickname || '',
    isPending: false,
    id: initialId || '',
  }
  const [state, formAction] = useActionState(uploadProfileImage, initialState);

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.imageContainer}>
        <input type="hidden" name="id" value={state.id} />
        {state?.imageUrl? (
          <Image
            src={state.imageUrl}
            alt="프로필 이미지"
            width={200}
            height={200}
            className={styles.profileImage}
          />
        ) : (
          <div className={styles.profileImagePlaceholder}>
            ?
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          name="image"
          className={styles.imageInput}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>별명</label>
        <input
          type="text"
          id="name"
          name="name"
          className={styles.input}
          placeholder={initialNickname}
        />
      </div>
      <button type="submit" className={styles.submitButton} disabled={state?.isPending}>
        {state?.isPending ? '저장 중...' : '저장'}
      </button>
      {state?.message && <p className={styles.message}>{state.message}</p>}
    </form>
  );
}