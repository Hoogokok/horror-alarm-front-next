import Image from 'next/image';
import styles from './components.module.css';
import Link from 'next/link';
import localFont from 'next/font/local';
import { Movie } from '@/\btypes/movie';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default async function ImageTabs({ provider, page }: { provider: string, page: string }) {
  const data: Movie[] = await fetch(`${process.env.MOVIE_API}/movies/streaming?provider=${provider}&page=${page}`, { 
    next: { revalidate: 3600 },
    headers: {
      'X-API-Key': process.env.MOVIE_API_KEY as string
    }
  }).then(res => res.json());

  return (
    <div className={styles.movieList}>
      {data.map((movie: Movie) => (
        <div key={movie.id} className={styles.movieItem}>
          <div className={styles.moviePosterContainer}>
            <Image 
                src={process.env.POSTER_URL + movie.posterPath} 
              alt={movie.title} 
              className={styles.moviePoster} 
              width={100}
              height={100}
            />
          </div>
          <Link href={`/movie/${movie.id}/${"streaming"}`} className={`${styles.movieTitle} ${doHyeon.className}`}>
            {movie.title}
          </Link>
        </div>
      ))}
    </div>
  );
}