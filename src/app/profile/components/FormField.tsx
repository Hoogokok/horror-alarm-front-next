'use client';
import styles from '@/app/profile/profile.module.css';

interface FormFieldProps {
    label: string;
    name: string;
    type: 'text' | 'password';
    value?: string;
    placeholder?: string;
    description?: string;
    error?: string;
}

export default function FormField({
    label,
    name,
    type,
    value,
    placeholder,
    description,
    error
}: FormFieldProps) {
    return (
        <div className={styles.inputGroup}>
            <label htmlFor={name} className={styles.label}>
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                className={styles.input}
                defaultValue={value}
                placeholder={placeholder}
            />
            {description && (
                <p className={styles.inputDescription}>
                    {description}
                </p>
            )}
            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}
        </div>
    );
} 