'use client';
import { useState, useRef } from 'react';

interface UseProfileImageProps {
    onImageChange: (file: File | null) => void;
}

interface UseProfileImageReturn {
    previewImage: string | null;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageDelete: () => void;
}

export function useProfileImage({ onImageChange }: UseProfileImageProps): UseProfileImageReturn {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageChange(file);
        }
    };

    const handleImageDelete = () => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageChange(null);
    };

    return {
        previewImage,
        fileInputRef,
        handleImageChange,
        handleImageDelete,
    };
} 