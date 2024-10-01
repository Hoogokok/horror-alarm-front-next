import Image from 'next/image';
import Link from 'next/link';
import styles from "../app/page.module.css";
import { MovieResponseDto } from '../types/movie-response-dto';

interface MovieListProps {
  movies: MovieResponseDto[];
  type: string;
}

export default function MovieList({ movies, type }: MovieListProps) {
  return (
    <div className={styles.content}>
      {movies.map((movie: MovieResponseDto) => (
        <div key={movie.id} className={styles.movieItem}>
          <Image
            alt={movie.title}
            src={process.env.POSTER_URL + movie.posterPath}
            width={250}
            height={300}
            priority={type === "upcoming"}
            className={styles.movieImage}
          />
          <Link href={`/movie/${movie.id}/${type}`} className={styles.movieTitle}>
            {movie.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
