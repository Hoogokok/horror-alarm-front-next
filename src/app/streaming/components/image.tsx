import Image from 'next/image';
import styles from './components.module.css';
import Link from 'next/link';
import localFont from 'next/font/local';
import { fetchStreamingMovies } from '@/utils/api';
import { Movie } from '@/\btypes/movie';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default async function ImageTabs({ provider, page }: { provider: string, page: string }) {
  const data = await fetchStreamingMovies(provider, page);

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
          <Link href={`/movie/${movie.id}/streaming`} className={`${styles.movieTitle} ${doHyeon.className}`}>
            {movie.title}
          </Link>
        </div>
      ))}
    </div>
  );
}