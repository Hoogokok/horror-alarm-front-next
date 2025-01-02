'use client';
import { useActionState } from 'react';
import { updatePassword, type PasswordUpdateState } from '@/app/auth/lib/actions/password';
import { useState } from 'react';

interface UsePasswordFormReturn {
    showPasswordSection: boolean;
    togglePasswordSection: () => void;
    passwordState: PasswordUpdateState;
    passwordFormAction: (formData: FormData) => void;
}

export function usePasswordForm(): UsePasswordFormReturn {
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const initialPasswordState: PasswordUpdateState = {
        error: {},
        message: '',
        isPending: false,
    }

    const [passwordState, passwordFormAction] = useActionState(updatePassword, initialPasswordState);

    const togglePasswordSection = () => {
        setShowPasswordSection(!showPasswordSection);
    };

    return {
        showPasswordSection,
        togglePasswordSection,
        passwordState,
        passwordFormAction,
    };
} 