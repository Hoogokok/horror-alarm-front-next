import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from "react";
import Loading from "./loading";
import styles from "./page.module.css";
import { Do_Hyeon } from "next/font/google";

const doHyeon = Do_Hyeon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const revalidate = 3600; // 1시간마다 재검증

export default async function Home() {
  const upcoming = await fetch(process.env.MOVIE_API + '/api/upcoming', { next: { revalidate: 3600 } }).then(res => res.json());
  const nowPlaying = await fetch(process.env.MOVIE_API + '/api/releasing', { next: { revalidate: 3600 } }).then(res => res.json());
  const streamingExpiring = await fetch(process.env.MOVIE_API + '/api/streaming/expired', { next: { revalidate: 3600 } }).then(res => res.json());
  const expiredList = streamingExpiring?.expiredMovies
  
  return (
    <main className={styles.main} style={doHyeon.style}>
      <section className={styles.imagesection}>
        <Suspense fallback={<Loading />}>
          <div className={styles.imagesectionTitle}>개봉 예정</div>
          {
            upcoming.length ? <div className={styles.content}>
              {upcoming.map((movie: any) => (
                <div key={movie.id} className={styles.movieItem}>
                  <Image
                    alt={movie.title}
                    src={process.env.POSTER_URL + movie.poster_path}
                    width={250}
                    height={300}
                    priority={true}
                    className={styles.movieImage}
                  />
                  <Link href={`/movie/${movie.id}/${"upcoming"}`} className={styles.movieTitle}>
                    {movie.title}
                  </Link>
                </div>
              ))}
            </div> : <div className={styles.content}>개봉 예정인 영화가 없어요!</div>
          }
          <div className={styles.imagesectionTitle}>상영중</div>
          {
            nowPlaying.length ? (
              <div className={styles.content}>
                {nowPlaying.map((movie: any) => (
                  <div key={movie.id} className={styles.movieItem}>
                    <Image
                      alt={movie.title}
                      src={process.env.POSTER_URL + movie.poster_path}
                      width={250}
                      height={300}
                      className={styles.movieImage}
                    />
                    <Link href={`/movie/${movie.id}/${"upcoming"}`} className={styles.movieTitle}>
                      {movie.title}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.content}>상영중인 영화가 없어요!</div>
            )
          }
          {
           <div className={styles.imagesectionTitle}>스트리밍 종료 예정</div>
          }
          {
            expiredList.length ? <div className={styles.content}>
              <div className={styles.content}>
                {expiredList.map((movie: any) => (
                  <div key={movie.id} className={styles.movieItem}>
                    <Image
                      alt={movie.title}
                      src={process.env.POSTER_URL + movie.poster_path}
                      width={250}
                      height={300}
                      className={styles.movieImage}
                    />
                    <Link href={`/movie/${movie.id}/${"streaming"}`} className={styles.movieTitle}>
                      {movie.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div> : <div className={styles.content}>
               스트리밍 종료 예정인 영화가 없어요!
            </div>
          }
        </Suspense>
      </section>
    </main>
  );
}
