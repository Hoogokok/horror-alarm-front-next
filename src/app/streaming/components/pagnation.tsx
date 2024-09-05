'use client';

import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };
    const allPages = generatePagination(currentPage, totalPages);
    return (
        <div>
            {allPages.map((page, index) => (
                <a
                    key={page}
                    href={createPageURL(page)}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: page === currentPage ? 'black' : 'grey',
                    }}
                >
                    {page}
                </a>
            ))}
        </div>
    );
}

const generatePagination = (currentPage: number, totalPages: number) => {
    // 만약 총 페이지 수가 7 이하이면,
    // 생략 부호 없이 모든 페이지를 표시합니다.
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    // 현재 페이지가 처음 3 페이지 중 하나인 경우,
    // 처음 3 페이지, 생략 부호, 마지막 2 페이지를 표시합니다.
    if (currentPage < 3) {
      return [1, 2, 3, '...', totalPages - 1, totalPages];
    }
  
    // 현재 페이지가 마지막 3 페이지 중 하나인 경우,
    // 처음 2 페이지, 생략 부호, 마지막 3 페이지를 표시합니다.
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }
  
    // 현재 페이지가 중간에 위치한 경우,
    // 첫 페이지, 생략 부호, 현재 페이지와 그 이웃들,
    // 다른 생략 부호, 마지막 페이지를 표시합니다.
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };
  