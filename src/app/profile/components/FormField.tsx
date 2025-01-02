'use client';
import styles from '@/app/profile/profile.module.css';
import FormMessage from './FormMessage';

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
                <FormMessage type="description">
                    {description}
                </FormMessage>
            )}
            {error && (
                <FormMessage type="error">
                    {error}
                </FormMessage>
            )}
        </div>
    );
} 