'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('영화 정보 로딩 오류:', error);
  }, [error]);

  const getErrorMessage = () => {
    switch (error.status) {
      case 404:
        return '요청하신 영화를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      default:
        return '영화 정보를 불러오는 중 문제가 발생했습니다.';
    }
  };

  return (
    <div className={styles.errorContainer} role="alert">
      <h2>{getErrorMessage()}</h2>
      <p>오류 코드: {error.status || '알 수 없음'}</p>
      <button onClick={() => reset()} aria-label="영화 정보 다시 불러오기">
        다시 시도
      </button>
    </div>
  );
}
