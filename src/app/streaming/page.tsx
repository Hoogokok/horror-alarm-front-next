import styles from "@/app/streaming/page.module.css";
import { Suspense } from "react";
import Images from './components/image';
import SearchTab from './components/searchTab';
import Pagination from './components/pagnation';
import ImageSkeleton from './components/imageskeleton';
import { searchMovies } from '@/utils/api';

export const experimental_ppr = true;

export default async function StreamingPage({ searchParams }: {
    searchParams?: {
        provider?: string;
        page?: string;
        search?: string;
    }
}) {
    const provider = searchParams?.provider || "all"
    const page = searchParams?.page || "1"
    const search = searchParams?.search || ""
    
    const { totalPages, movies } = await searchMovies(provider, page, search);

    return (
        <div className={styles.streamingContainer}>
            <div className={styles.searchTabWrapper}>
                <SearchTab />
            </div>
            <div className={styles.imageGalleryWrapper}>
                <Suspense key={provider + page + search} fallback={<ImageSkeleton />}>
                    <Images movies={movies} />
                </Suspense>
            </div>
            <div className={styles.paginationWrapper}>
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}