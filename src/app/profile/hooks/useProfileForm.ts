'use client';
import { useActionState } from 'react';
import { updateProfile, type UploadProfileImageState } from '@/app/auth/lib/actions/profile';
import { useCallback } from 'react';

interface UseProfileFormProps {
    name: string;
    image_url: string;
    id: string;
}

interface UseProfileFormReturn {
    state: UploadProfileImageState;
    handleImageUpdate: (file: File | null) => void;
    handleSubmit: (formData: FormData) => void;
}

export function useProfileForm({ name, image_url, id }: UseProfileFormProps): UseProfileFormReturn {
    const initialState: UploadProfileImageState = {
        error: '',
        message: '',
        imageUrl: image_url || '',
        name: name || '',
        isPending: false,
        id: id || '',
    }

    const [state, formAction] = useActionState(updateProfile, initialState);

    const handleImageUpdate = (file: File | null) => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formAction(formData);
        }
    };

    const handleSubmit = useCallback((formData: FormData) => {
        formAction(formData);
    }, [formAction]);

    return {
        state,
        handleImageUpdate,
        handleSubmit,
    };
} 