'use client';
import styles from '@/app/profile/profile.module.css';

interface FormMessageProps {
    type: 'error' | 'success' | 'description';
    children: React.ReactNode;
}

export default function FormMessage({ type, children }: FormMessageProps) {
    const messageStyles = {
        error: styles.error,
        success: styles.message,
        description: styles.inputDescription,
    };

    if (!children) return null;

    return (
        <p className={messageStyles[type]}>
            {children}
        </p>
    );
} 