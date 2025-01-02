'use client';
import Image from 'next/image';
import styles from '@/app/profile/profile.module.css';
import { useProfileImage } from '../hooks/useProfileImage';

interface ProfileImageSectionProps {
    imageUrl?: string;
    name?: string;
    onImageChange: (file: File | null) => void;
}

export default function ProfileImageSection({
    imageUrl,
    name,
    onImageChange
}: ProfileImageSectionProps) {
    const {
        previewImage,
        fileInputRef,
        handleImageChange,
        handleImageDelete
    } = useProfileImage({ onImageChange });

    return (
        <div className={styles.imageSection}>
            {previewImage || imageUrl ? (
                <Image
                    src={previewImage || imageUrl || ''}
                    alt="프로필 이미지"
                    width={200}
                    height={200}
                    unoptimized
                    className={styles.profileImage}
                />
            ) : (
                <div className={styles.profileImagePlaceholder}>
                    {name ? name[0].toUpperCase() : '?'}
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
            <label htmlFor="image" className={styles.changeImageButton}>
                이미지 변경
            </label>
            {previewImage && (
                <button
                    type="button"
                    onClick={handleImageDelete}
                    className={styles.deleteImageButton}
                >
                    이미지 삭제
                </button>
            )}
        </div>
    );
} 