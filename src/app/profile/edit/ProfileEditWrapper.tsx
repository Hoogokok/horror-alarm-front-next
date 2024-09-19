'use client';
import Image from 'next/image';
import { useActionState } from 'react';
import { updateProfile, UploadProfileImageState } from '@/app/auth/lib/actions';
import styles from '@/app/profile/profile.module.css';
import Link from 'next/link';
import { useState, useRef, useCallback} from 'react';
import localFont from 'next/font/local';

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            <div className={styles.imageSection}>
              <input type="hidden" name="id" value={state.id} />
              {previewImage || state?.imageUrl ? (
                <Image
                  src={previewImage || state.imageUrl || ''}
                  alt="프로필 이미지"
                  width={200}
                  height={200}
                  unoptimized
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  {state.name ? state.name[0].toUpperCase() : '?'}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                name="image"
                id="image"
                className={styles.imageInput}
                onChange={handleImageChange}
                ref={fileInputRef}
              />
              <label htmlFor="image" className={styles.changeImageButton}>이미지 변경</label>
              {previewImage && (
                <button type="button" onClick={handleImageDelete} className={styles.deleteImageButton}>
                  이미지 삭제
                </button>
              )}
            </div>
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
        {state?.message && <p className={styles.message}>{state.message}</p>}
      </div>
    </div>
  );
}