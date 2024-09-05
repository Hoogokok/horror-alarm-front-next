import Image from 'next/image';
import styles from "../page.module.css";
import { Suspense } from "react";
import Images from './components/image';
import SearchTab from './components/searchTab';
import Pagination from './components/pagnation';

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
    const totalPages = await fetch(url).then(res => res.json());
    return (
        <div>
            <SearchTab />
            <h1 className={styles.title}>스트리밍</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <Images query={query} page={page} /> 
            </Suspense>
            <Pagination totalPages={totalPages} />
        </div>
    );
}