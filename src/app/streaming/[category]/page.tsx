import Image from 'next/image';
import styles from "./page.module.css";


export default async function StreamingPage() {
    const netflix = await fetch(process.env.MOVIE_API + '/api/streaming/1', { cache: "force-cache" }).then(res => res.json());
    const diseney = await fetch(process.env.MOVIE_API + '/api/streaming/2', { cache: "force-cache" }).then(res => res.json());
    return (
        <div className={styles.main}>
        </div>
    );
}