'use client';

import { useState } from 'react';
import styles from './components.module.css';

interface StarRatingProps {
    rating: number;
    setRating: (rating: number) => void;
}

export function StarRating({ rating, setRating }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleKeyDown = (e: React.KeyboardEvent, star: number) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                setRating(Math.max(1, rating - 1));
                break;
            case 'ArrowRight':
                e.preventDefault();
                setRating(Math.min(5, rating + 1));
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                setRating(star);
                break;
        }
    };

    return (
        <div
            className={styles.starRating}
            onMouseLeave={() => setHoverRating(0)}
            role="group"
            aria-label="영화 평점"
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <label
                    key={star}
                    onMouseEnter={() => {
                        const stars = [];
                        for (let i = 1; i <= star; i++) {
                            stars.push(i);
                        }
                        setHoverRating(star);
                    }}
                >
                    <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={rating === star}
                        onChange={() => setRating(star)}
                        onKeyDown={(e) => handleKeyDown(e, star)}
                        aria-label={`${star}점`}
                        tabIndex={0}
                    />
                    <span
                        className={`${styles.star} ${(hoverRating || rating) >= star ? styles.filled : ''}`}
                        role="presentation"
                        aria-hidden="true"
                    >
                        ★
                    </span>
                </label>
            ))}
            <span className="sr-only">
                {rating ? `현재 선택된 평점: ${rating}점` : '평점을 선택해주세요'}
            </span>
        </div>
    );
} 