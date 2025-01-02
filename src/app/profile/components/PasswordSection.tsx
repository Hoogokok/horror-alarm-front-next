'use client';
import { useActionState } from 'react';
import { updatePassword, type PasswordUpdateState } from '@/app/auth/lib/actions/password';
import styles from '@/app/profile/profile.module.css';
import { useState } from 'react';

export default function PasswordSection() {
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const initialPasswordState: PasswordUpdateState = {
        error: {},
        message: '',
        isPending: false,
    }

    const [passwordState, passwordFormAction] = useActionState(updatePassword, initialPasswordState);

    return (
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
                            className={`${styles.saveButton}`}
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