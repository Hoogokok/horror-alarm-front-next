'use client';
import styls from './components.module.css';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchTab() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const handleClick = useDebouncedCallback((query: string) => {
       const params = new URLSearchParams(searchParams);
       params.set('page', '1');
       if (query) {
         params.set('query', query);
       } else {
         params.delete('query');
       }
       replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className={styls.searchTab}>
            <button onClick={() => handleClick("all")} className={styls.searchButton}>모든 서비스</button>
            <button onClick={() => handleClick("netflix")} className={styls.searchButton}>넷플릭스</button>
            <button onClick={() => handleClick("disney")} className={styls.searchButton}>디즈니+</button>
        </div>
    );
}

