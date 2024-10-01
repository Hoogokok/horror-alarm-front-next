import { Do_Hyeon } from "next/font/google";
import { Suspense } from "react";
import ExpiringMovieList from './components/ExpiringMovieList';
import MovieList from './components/MovieLIst';
import Loading from "./loading";
import styles from "./page.module.css";
import { fetchExpiringMovies, fetchNowPlayingMovies, fetchUpcomingMovies } from './utils/fetchMovies';

const doHyeon = Do_Hyeon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const revalidate = 3600; // 1시간마다 재검증

export default async function Home() {
  const upcoming = await fetchUpcomingMovies();
  const nowPlaying = await fetchNowPlayingMovies();
  const streamingExpiring = await fetchExpiringMovies();
  
  return (
    <main className={styles.main} style={doHyeon.style}>
      <section className={styles.imagesection}>
        <Suspense fallback={<Loading />}>
          <div className={styles.imagesectionTitle}>개봉 예정</div>
          {upcoming.length ? (
            <MovieList movies={upcoming} type="upcoming" />
          ) : (
            <div className={styles.content}>개봉 예정인 영화가 없어요!</div>
          )}
          
          <div className={styles.imagesectionTitle}>상영중</div>
          {nowPlaying.length ? (
            <MovieList movies={nowPlaying} type="released" />
          ) : (
            <div className={styles.content}>상영중인 영화가 없어요!</div>
          )}
          
          <div className={styles.imagesectionTitle}>스트리밍 종료 예정</div>
          {
            streamingExpiring.length ? (
              <ExpiringMovieList movies={streamingExpiring} />
            ) : (
              <div className={styles.content}>스트리밍 종료 예정인 영화가 없어요!</div>
            )
          }
        </Suspense>
      </section>
    </main>
  );
}
