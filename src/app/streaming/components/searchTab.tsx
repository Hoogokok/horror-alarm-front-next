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
       // Handle search
       params.set('page', '1');
       if (query) {
         params.set('query', query);
       } else {
         params.delete('query');
       }
       replace(`${pathname}?${params.toString()}`);
    }
    , 300);

    return (
        <div className={styls.buttonsection}>
            <button
                onClick={() => handleClick("all")}
            >
                All
            </button>
            <button
                onClick={() => handleClick("netflix")}
            >
                Netflix
            </button>
            <button
                onClick={() => handleClick("disney")}
            >
                Disney+
            </button>
        </div>
    );
}

