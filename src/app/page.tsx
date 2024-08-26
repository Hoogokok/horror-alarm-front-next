import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from "react";
import Loading from "./loading";
import styles from "./page.module.css";

const imageStyle = {
  padding: '10px',
  borderRadius: '20px',
}

export default async function Home() {
  const upcoming = await fetch(process.env.MOVIE_API + '/api/upcoming', { cache: 'force-cache', next: { revalidate: 7200 } }).then(res => res.json());
  const nowPlaying = await fetch(process.env.MOVIE_API + '/api/releasing', { cache: 'force-cache' }).then(res => res.json());
  const streamingExpiring = await fetch(process.env.MOVIE_API + '/api/streaming/expired', { cache: 'force-cache' }).then(res => res.json());
  const streaming = await fetch(process.env.MOVIE_API + '/api/streaming/netflix', { cache: 'force-cache' }).then(res => res.json());
  return (
    <main className={styles.main}>
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li className={styles.menu}>
            <Link href="/upcoming">
              개봉 예정
            </Link>
          </li>
          <li className={styles.menu}>
            <Link href="/now-playing">
              상영중
            </Link>
          </li>
          <li className={styles.menu}>
            <Link href="/streaming">
              스트리밍 종료 예정
            </Link>
          </li>
          <li className={styles.menu}>
            <Link href="/top-rated">
              인기 영화
            </Link>
          </li>
          <li className={styles.menu}>
            로그인 / 회원가입
          </li>
        </ul>
      </nav>
      <section className={styles.imagesection}>
        <Suspense fallback={<Loading />}>
          <div className={styles.imagesectionTitle}>개봉 예정</div>
          {
            upcoming.length ? <div className={styles.content}>
              {upcoming.map((movie: any) => (
                <Image
                  key={movie.id}
                  alt={movie.title}
                  src={process.env.POSTER_URL + movie.posterPath}
                  width={250}
                  height={300}
                  style={imageStyle}
                />
              ))}
            </div> : <div className={styles.content}>개봉 예정인 영화가 없습니다.</div>
          }
          <div className={styles.imagesectionTitle}>상영중</div>
          {
            nowPlaying.length ? <div className={styles.content}>
              {nowPlaying.map((movie: any) => (
                <Image
                  key={movie.id}
                  alt={movie.title}
                  src={process.env.POSTER_URL + movie.posterPath}
                  width={250}
                  height={300}
                  style={imageStyle}
                />
              ))}
            </div> : <div className={styles.content}>상영중인 영화가 없습니다.</div>
          }
          {
            streamingExpiring.length ? <div className={styles.imagesectionTitle}>스트리밍 종료 예정</div>
              : <div className={styles.imagesectionTitle}>넷플릭스 호러</div>
          }
          {
            streamingExpiring.length ? <div className={styles.content}>
              {streamingExpiring.map((movie: any) => (
                console.log(movie),
                <Image
                  key={movie.id}
                  alt={movie.title}
                  src={process.env.POSTER_URL + movie.posterPath}
                  width={250}
                  height={300}
                  style={imageStyle}
                />
              ))}
            </div> : <div className={styles.content}>
              {streaming.map((movie: any) => (
                <Image
                  key={movie.id}
                  alt={movie.title}
                  src={process.env.POSTER_URL + movie.poster_path}
                  width={250}
                  height={300}
                  style={imageStyle}
                />
              ))}
            </div>
          }
        </Suspense>
      </section>
    </main>
  );
}
