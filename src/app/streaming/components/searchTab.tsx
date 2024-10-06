'use client';
import styles from './components.module.css';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import localFont from 'next/font/local';
import { useState } from 'react';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default function SearchTab() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleClick = useDebouncedCallback((provider: string) => {
       const params = new URLSearchParams(searchParams);
       params.set('page', '1');
       if (provider) {
         params.set('provider', provider);
       } else {
         params.delete('provider');
       }
       replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleSearch = useDebouncedCallback((query: string) => {
       const params = new URLSearchParams(searchParams);
       params.set('page', '1');
       if (query) {
         params.set('search', query);
       } else {
         params.delete('search');
       }
       replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className={styles.searchTab}>
            <button onClick={() => handleClick("all")} className={`${styles.searchButton} ${doHyeon.className}`}>모든 서비스</button>
            <button onClick={() => handleClick("netflix")} className={`${styles.searchButton} ${doHyeon.className}`}>넷플릭스</button>
            <button onClick={() => handleClick("disney")} className={`${styles.searchButton} ${doHyeon.className}`}>디즈니+</button>
            <button onClick={() => handleClick("wavve")} className={`${styles.searchButton} ${doHyeon.className}`}>웨이브</button>
            <button onClick={() => handleClick("naver")} className={`${styles.searchButton} ${doHyeon.className}`}>네이버</button>
            <button onClick={() => handleClick("googleplay")} className={`${styles.searchButton} ${doHyeon.className}`}>구글 플레이</button>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                }}
                placeholder="영화 검색"
                className={`${styles.searchInput} ${doHyeon.className}`}
            />
        </div>
    );
}

