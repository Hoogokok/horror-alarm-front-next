import styles from "@/app/streaming/page.module.css";
import { Suspense } from "react";
import Images from './components/image';
import SearchTab from './components/searchTab';
import Pagination from './components/pagnation';
import ImageSkeleton from './components/imageskeleton';
export const experimental_ppr = true;

export default async function StreamingPage({ searchParams }: {
    searchParams?: {
        query?: string;
        page?: string;
    }
}) {
    const query = searchParams?.query || "all" // default query is all
    const page = searchParams?.page || "1" // default page is 1
    const url = `${process.env.MOVIE_API}/api/streaming?query=${query}`;
    const totalPages = await fetch(url, { cache: "force-cache" }).then(res => res.json());
    return (
        <div className={styles.streamingContainer}>
            <div className={styles.searchTabWrapper}>
                <SearchTab />
            </div>
            <div className={styles.imageGalleryWrapper}>
                <Suspense
                    key={query + page}
                    fallback={
                        <ImageSkeleton />
                    }>
                    <Images query={query} page={page} />
                </Suspense>
            </div>
            <div className={styles.paginationWrapper}>
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}