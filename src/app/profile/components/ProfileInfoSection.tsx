'use client';
import { useActionState } from 'react';
import { updateProfile, type UploadProfileImageState } from '@/app/auth/lib/actions/profile';
import styles from '@/app/profile/profile.module.css';
import Link from 'next/link';

interface ProfileInfoSectionProps {
    name?: string;
    id?: string;
    isPending?: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function ProfileInfoSection({
    name,
    id,
    isPending,
    onSubmit
}: ProfileInfoSectionProps) {
    return (
        <div className={styles.infoSection}>
            <input type="hidden" name="id" value={id} />
            <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>이름</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.input}
                    defaultValue={name}
                    placeholder="이름을 입력하세요"
                />
                <p className={styles.inputDescription}>
                    이름은 최소 2자, 최대 20자까지 입력이 가능해요<br />
                    수정한 정보는 다른 서비스에도 동일하게 표시돼요
                </p>
            </div>
            <div className={styles.buttonGroup}>
                <Link href="/profile" className={styles.cancelButton}>
                    취소
                </Link>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isPending}
                >
                    {isPending ? '저장 중...' : '변경 저장'}
                </button>
            </div>
        </div>
    );
} 