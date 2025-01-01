import { ErrorType } from "@/types/error";
import styles from '../styles/reviews.module.css';

interface ReviewErrorProps {
    error: ErrorType;
}

export function ReviewError({ error }: ReviewErrorProps) {
    if (!error) return null;

    if (typeof error === 'string') {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <ul className={styles.errorList}>
            {Object.entries(error).map(([key, errors]) => (
                errors?.map((error, index) => (
                    <li key={`${key}-${index}`} className={styles.errorItem}>{error}</li>
                ))
            ))}
        </ul>
    );
}