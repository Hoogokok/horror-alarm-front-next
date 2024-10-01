import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from "react";
import Loading from "./loading";
import styles from "./page.module.css";
import { Do_Hyeon } from "next/font/google";
import { MovieResponseDto } from './types/movie-response-dto';  // 이 타입을 정의해야 합니다
import { ExpiringMovieResponseDto } from './types/expiring-response-dto';

const doHyeon = Do_Hyeon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const revalidate = 3600; // 1시간마다 재검증

export default async function Home() {
  const upcoming: MovieResponseDto[] = await fetch(process.env.MOVIE_API + '/movies/theater/upcoming', { 
    next: { revalidate: 3600 },
    headers: {
      'X-API-Key': process.env.MOVIE_API_KEY as string
    }
  }).then(res => res.json());
  const nowPlaying: MovieResponseDto[] = await fetch(process.env.MOVIE_API + '/movies/theater/released', { 
    next: { revalidate: 3600 },
    headers: {
      'X-API-Key': process.env.MOVIE_API_KEY as string
    }
  }).then(res => res.json());
  const streamingExpiring: ExpiringMovieResponseDto[] = await fetch(process.env.MOVIE_API + '/movies/expiring-horror', { 
    next: { revalidate: 3600 },
    headers: {
      'X-API-Key': process.env.MOVIE_API_KEY as string
    }
  }).then(res => res.json());
  
  return (
    <main className={styles.main} style={doHyeon.style}>
      <section className={styles.imagesection}>
        <Suspense fallback={<Loading />}>
          <div className={styles.imagesectionTitle}>개봉 예정</div>
          {
            upcoming.length ? <div className={styles.content}>
              {upcoming.map((movie: MovieResponseDto) => (
                <div key={movie.id} className={styles.movieItem}>
                  <Image
                    alt={movie.title}
                    src={process.env.POSTER_URL + movie.posterPath}
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
                {nowPlaying.map((movie: MovieResponseDto) => (
                  <div key={movie.id} className={styles.movieItem}>
                    <Image
                      alt={movie.title}
                      src={process.env.POSTER_URL + movie.posterPath}
                      width={250}
                      height={300}
                      className={styles.movieImage}
                    />
                    <Link href={`/movie/${movie.id}/${"released"}`} className={styles.movieTitle}>
                      {movie.title}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.content}>상영중인 영화가 없어요!</div>
            )
          }
          <div className={styles.imagesectionTitle}>스트리밍 종료 예정</div>
          {
            streamingExpiring.length ? (
              <div className={styles.content}>
                {streamingExpiring.map((movie: ExpiringMovieResponseDto) => (
                  <div key={movie.id} className={styles.movieItem}>
                    <Image
                      alt={movie.title}
                      src={process.env.POSTER_URL + movie.posterPath}
                      width={250}
                      height={300}
                      className={styles.movieImage}
                    />
                    <Link href={`/movie/${movie.id}/${"expiring"}`} className={styles.movieTitle}>
                      {movie.title}
                    </Link>
                    <div className={styles.expiringDate}>
                      {new Date(movie.expiringDate).toLocaleDateString()}
                    </div>
                    <div className={styles.providers}>
                      {movie.providers}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.content}>스트리밍 종료 예정인 영화가 없어요!</div>
            )
          }
        </Suspense>
      </section>
    </main>
  );
}
