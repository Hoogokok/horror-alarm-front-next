import Image from 'next/image';
import styles from "../[slug]/page.module.css";
import { Suspense } from "react";
import ImageTabs from './components/imageTabs';

export default async function StreamingPage() {
    const netflix = await fetch(process.env.MOVIE_API + '/api/streaming/1', { cache: "force-cache" }).then(res => res.json());
    const diseney = await fetch(process.env.MOVIE_API + '/api/streaming/2', { cache: "force-cache" }).then(res => res.json());
    const movies = netflix.map((movie: any) => { return { ...movie, platform: 'netflix' } }
    ).concat(diseney.map((movie: any) => { return { ...movie, platform: 'disney' } })).filter((movie: any) => movie.posterPath);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className={styles.main}>
                
            </div>
        </Suspense>
    );
}