import { ErrorType } from '@/types/error';
import styles from '@/app/movie/[id]/[category]/components/styles/common.module.css';

export function renderError(error: ErrorType) {
    if (!error) return null;

    if (typeof error === 'string') {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <ul className={styles.errorList}>
            {Object.entries(error).map(([key, errors]) => (
                errors && errors.map((error, index) => (
                    <li key={`${key}-${index}`} className={styles.errorItem}>{error}</li>
                ))
            ))}
        </ul>
    );
} 