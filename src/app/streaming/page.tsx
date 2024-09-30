import styles from "@/app/streaming/page.module.css";
import { Suspense } from "react";
import Images from './components/image';
import SearchTab from './components/searchTab';
import Pagination from './components/pagnation';
import ImageSkeleton from './components/imageskeleton';
export const experimental_ppr = true;

export default async function StreamingPage({ searchParams }: {
    searchParams?: {
        provider?: string;
        page?: string;
    }
}) {
    const provider = searchParams?.provider || "all" // 기본 제공자는 all
    const page = searchParams?.page || "1" // 기본 페이지는 1
    const url = `${process.env.MOVIE_API}/movies/streaming/pages?provider=${provider}`;
    const { totalPages } = await fetch(url, { next: { revalidate: 3600 } }).then(res => res.json());
    return (
        <div className={styles.streamingContainer}>
            <div className={styles.searchTabWrapper}>
                <SearchTab />
            </div>
            <div className={styles.imageGalleryWrapper}>
                <Suspense
                    key={provider + page}
                    fallback={
                        <ImageSkeleton />
                    }>
                    <Images provider={provider} page={page} />
                </Suspense>
            </div>
            <div className={styles.paginationWrapper}>
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}