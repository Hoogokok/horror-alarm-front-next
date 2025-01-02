'use client';
import Image from 'next/image';
import { useActionState } from 'react';
import { 
  updateProfile, 
  type UploadProfileImageState 
} from '@/app/auth/lib/actions/profile'
import { 
  updatePassword, 
  type PasswordUpdateState 
} from '@/app/auth/lib/actions/password'
import styles from '@/app/profile/profile.module.css';
import Link from 'next/link';
import { useState, useRef, useCallback} from 'react';
import localFont from 'next/font/local';
import ProfileImageSection from '../components/ProfileImageSection';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

interface ProfileEditProps {
  name: string;
  image_url: string;
  id: string;
}

interface PasswordSection {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const initialPasswordState: PasswordUpdateState = {
    error: {},
    message: '',
    isPending: false,
  }

  const [passwordState, passwordFormAction] = useActionState(updatePassword, initialPasswordState);

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
            <div className={styles.infoSection}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  defaultValue={state.name}
                  placeholder="이름을 입력하세요"
                />
                <p className={styles.inputDescription}>이름은 최소 2자, 최대 20자까지 입력이 가능해요<br />수정한 정보는 다른 서비스에도 동일하게 표시돼요</p>
              </div>
              <div className={styles.buttonGroup}>
                <Link href="/profile" className={styles.cancelButton}>취소</Link>
                <button type="submit" className={`${styles.saveButton} ${doHyeon.className}`} disabled={state?.isPending}>
                  {state?.isPending ? '저장 중...' : '변경 저장'}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className={styles.passwordSection}>
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className={styles.togglePasswordButton}
          >
            비밀번호 변경 {showPasswordSection ? '그만하기' : '하기'}
          </button>

          {showPasswordSection && (
            <form
              className={styles.passwordForm}
              action={passwordFormAction}
            >
              <div className={styles.inputGroup}>
                <label htmlFor="currentPassword" className={styles.label}>
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className={styles.input}
                  placeholder="현재 비밀번호를 입력하세요"
                />
                {passwordState?.error?.currentPassword && (
                  <p className={styles.error}>{passwordState.error.currentPassword[0]}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  새 비밀번호
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className={styles.input}
                  placeholder="새 비밀번호를 입력하세요"
                />
                {passwordState?.error?.newPassword && (
                  <p className={styles.error}>{passwordState.error.newPassword[0]}</p>
                )}
                <p className={styles.inputDescription}>
                  비밀번호는 최소 8자 이상이며, 특수문자를 포함해야 합니다
                </p>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={styles.input}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
                {passwordState?.error?.confirmPassword && (
                  <p className={styles.error}>{passwordState.error.confirmPassword[0]}</p>
                )}
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="submit" 
                  className={`${styles.saveButton} ${doHyeon.className}`}
                  disabled={passwordState?.isPending}
                >
                  {passwordState?.isPending ? '변경 중...' : '비밀번호 변경'}
                </button>
              </div>

              {passwordState?.message && (
                <p className={passwordState.error ? styles.error : styles.message}>
                  {passwordState.message}
                </p>
              )}
            </form>
          )}
        </div>

        {state?.message && <p className={styles.message}>{state.message}</p>}
      </div>
    </div>
  );
}