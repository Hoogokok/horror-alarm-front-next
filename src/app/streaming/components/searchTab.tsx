'use client';
import styls from './components.module.css';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import localFont from 'next/font/local';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default function SearchTab() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
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

    return (
        <div className={styls.searchTab}>
            <button onClick={() => handleClick("all")} className={`${styls.searchButton} ${doHyeon.className}`}>모든 서비스</button>
            <button onClick={() => handleClick("netflix")} className={`${styls.searchButton} ${doHyeon.className}`}>넷플릭스</button>
            <button onClick={() => handleClick("disney")} className={`${styls.searchButton} ${doHyeon.className}`}>디즈니+</button>
        </div>
    );
}

