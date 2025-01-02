'use client';
import styles from '@/app/profile/profile.module.css';
import Link from 'next/link';

interface FormButtonProps {
    type?: 'submit' | 'button';
    variant: 'primary' | 'secondary' | 'toggle';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    href?: string;
}

export default function FormButton({
    type = 'button',
    variant,
    children,
    onClick,
    disabled,
    href
}: FormButtonProps) {
    const buttonStyles = {
        primary: styles.saveButton,
        secondary: styles.cancelButton,
        toggle: styles.togglePasswordButton,
    };

    if (href) {
        return (
            <Link href={href} className={buttonStyles[variant]}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={buttonStyles[variant]}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
} 