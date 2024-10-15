import Image from 'next/image';
import styles from './components.module.css';
import Link from 'next/link';
import localFont from 'next/font/local';
import { Movie } from '@/\btypes/movie';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default function Images({ movies }: { movies: Movie[] }) {
  return (
    <div className={styles.movieList}>
      {movies.map((movie: Movie) => (
        <Link href={`/movie/${movie.id}/streaming`} key={movie.id} className={styles.movieItem}>
          <div className={styles.moviePosterContainer}>
            <Image 
              unoptimized
              src={process.env.POSTER_URL + movie.posterPath} 
              alt={movie.title} 
              className={styles.moviePoster} 
              width={100}
              height={100}
            />
          </div>
          <div className={`${styles.movieTitle} ${doHyeon.className}`}>
            {movie.title}
          </div>
        </Link>
      ))}
    </div>
  );
}