'use client';
import { useActionState } from 'react';
import { updateProfile, type UploadProfileImageState } from '@/app/auth/lib/actions/profile';
import { useCallback, useState } from 'react';

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
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
        setSelectedImage(file);
    };

    const handleSubmit = useCallback((formData: FormData) => {
        if (selectedImage) {
            formData.set('image', selectedImage);
        }
        formAction(formData);
    }, [formAction, selectedImage]);

    return {
        state,
        handleImageUpdate,
        handleSubmit,
    };
} 