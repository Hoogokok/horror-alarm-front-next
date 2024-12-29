import { ErrorType } from '@/types/error';
import styles from '@/app/movie/[id]/[category]/components/components.module.css';

export function renderError(error: ErrorType) {
    if (!error) return null;

    if (typeof error === 'string') {
        return (
            <p className={styles.error} role="alert">
                {error}
            </p>
        );
    }

    const errors = Object.entries(error)
        .filter(([_, messages]) => messages && messages.length > 0);

    if (errors.length === 0) return null;

    return (
        <ul className={styles.errorList} role="alert">
            {errors.map(([key, messages]) =>
                messages?.map((message, index) => (
                    <li key={`${key}-${index}`} className={styles.errorItem}>
                        {message}
                    </li>
                ))
            )}
        </ul>
    );
} 