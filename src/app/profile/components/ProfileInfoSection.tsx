'use client';

import styles from '@/app/profile/profile.module.css';
import FormField from './FormField';
import FormButton from './FormButton';

interface ProfileInfoSectionProps {
    name?: string;
    id?: string;
    isPending?: boolean;
}

export default function ProfileInfoSection({
    name,
    id,
    isPending,
}: ProfileInfoSectionProps) {
    return (
        <div className={styles.infoSection}>
            <input type="hidden" name="id" value={id} />
            <FormField
                label="이름"
                name="name"
                type="text"
                value={name}
                placeholder="이름을 입력하세요"
                description="이름은 최소 2자, 최대 20자까지 입력이 가능해요&#13;수정한 정보는 다른 서비스에도 동일하게 표시돼요"
            />
            <div className={styles.buttonGroup}>
                <FormButton
                    variant="secondary"
                    href="/profile"
                >
                    취소
                </FormButton>
                <FormButton
                    type="submit"
                    variant="primary"
                    disabled={isPending}
                >
                    {isPending ? '저장 중...' : '변경 저장'}
                </FormButton>
            </div>
        </div>
    );
} 