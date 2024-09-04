import Image from 'next/image';
import styles from "../[slug]/page.module.css";
import { Suspense } from "react";
import ImageTabs from './components/imageTabs';

export default async function StreamingPage({ params }: { params: { slug: string } }) {
    const netflix = await fetch(process.env.MOVIE_API + '/api/streaming/1', { cache: "force-cache" }).then(res => res.json());
    const diseney = await fetch(process.env.MOVIE_API + '/api/streaming/2', { cache: "force-cache" }).then(res => res.json());
    const movies = netflix.map((movie: any) => { return { ...movie, platform: 'netflix' } }
    ).concat(diseney.map((movie: any) => { return { ...movie, platform: 'disney' } })).filter((movie: any) => movie.posterPath);
    return (
        <div>
            <h1 className={styles.title}>스트리밍</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ImageTabs initialMovies={movies} />
            </Suspense>
        </div>
    );
}