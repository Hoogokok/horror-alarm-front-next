'use client';

import { useState } from 'react';
import styles from './components.module.css';
import { RATING, RATING_MESSAGES } from '@/constants/rating';

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
                setRating(Math.max(RATING.MIN, rating - RATING.STEP));
                break;
            case 'ArrowRight':
                e.preventDefault();
                setRating(Math.min(RATING.MAX, rating + RATING.STEP));
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
            aria-label={RATING_MESSAGES.RATING_LABEL}
        >
            {Array.from({ length: RATING.MAX }, (_, i) => i + 1).map((star) => (
                <label
                    key={star}
                    onMouseEnter={() => {
                        const stars = [];
                        for (let i = RATING.MIN; i <= star; i++) {
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
                        aria-label={RATING_MESSAGES.STAR_LABEL(star)}
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
                {rating
                    ? RATING_MESSAGES.CURRENT_RATING(rating)
                    : RATING_MESSAGES.SELECT_RATING}
            </span>
        </div>
    );
} 