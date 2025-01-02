'use client';
import styles from '@/app/profile/profile.module.css';
import { usePasswordForm } from '../hooks/usePasswordForm';
import FormField from './FormField';

export default function PasswordSection() {
    const {
        showPasswordSection,
        togglePasswordSection,
        passwordState,
        passwordFormAction
    } = usePasswordForm();

    return (
        <div className={styles.passwordSection}>
            <button
                type="button"
                onClick={togglePasswordSection}
                className={styles.togglePasswordButton}
            >
                비밀번호 변경 {showPasswordSection ? '그만하기' : '하기'}
            </button>

            {showPasswordSection && (
                <form
                    className={styles.passwordForm}
                    action={passwordFormAction}
                >
                    <FormField
                        label="현재 비밀번호"
                        name="currentPassword"
                        type="password"
                        placeholder="현재 비밀번호를 입력하세요"
                        error={passwordState?.error?.currentPassword?.[0]}
                    />
                    <FormField
                        label="새 비밀번호"
                        name="newPassword"
                        type="password"
                        placeholder="새 비밀번호를 입력하세요"
                        description="비밀번호는 최소 8자 이상이며, 특수문자를 포함해야 합니다"
                        error={passwordState?.error?.newPassword?.[0]}
                    />
                    <FormField
                        label="새 비밀번호 확인"
                        name="confirmPassword"
                        type="password"
                        placeholder="새 비밀번호를 다시 입력하세요"
                        error={passwordState?.error?.confirmPassword?.[0]}
                    />

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            className={styles.saveButton}
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
    );
} 