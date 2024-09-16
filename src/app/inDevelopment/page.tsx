import Link from 'next/link';
import styles from './inDevelopment.module.css';

export default function InDevelopment() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>개발 중입니다</h1>
            <p className={styles.message}>
                죄송합니다. 이 기능은 현재 개발 중입니다. 곧 완성될 예정이니 조금만 기다려 주세요!
            </p>
            <Link href="/" className={styles.link}>
                메인 페이지로 돌아가기
            </Link>
        </div>
    );
}