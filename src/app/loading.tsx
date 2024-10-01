import Skeleton from '@/app/components/Skeleton';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <Skeleton height="200px" />
            <div className={styles.contentSkeleton}>
                <Skeleton height="30px" width="60%" />
                <Skeleton height="20px" width="90%" />
                <Skeleton height="20px" width="80%" />
                <Skeleton height="20px" width="85%" />
            </div>
            <div className={styles.gridSkeleton}>
                {[...Array(6)].map((_, index) => (
                    <div key={index} className={styles.gridItem}>
                        <Skeleton height="150px" />
                        <Skeleton height="20px" width="80%" style={{ marginTop: '10px' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}