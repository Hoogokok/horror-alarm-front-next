import Image from 'next/image';
import Link from 'next/link';
import styles from "../app/page.module.css";
import { ExpiringMovieResponseDto } from "../types/expiring-response-dto"

interface ExpiringMovieListProps {
  movies: ExpiringMovieResponseDto[];
}

export default function ExpiringMovieList({ movies }: ExpiringMovieListProps) {
  return (
    <div className={styles.content}>
      {movies.map((movie: ExpiringMovieResponseDto) => (
        <div key={movie.id} className={styles.movieItem}>
          <Image
            alt={movie.title}
            src={process.env.POSTER_URL + movie.posterPath}
            width={250}
            height={300}
            className={styles.movieImage}
          />
          <Link href={`/movie/${movie.id}/expiring`} className={styles.movieTitle}>
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
  );
}