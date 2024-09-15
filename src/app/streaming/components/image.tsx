import Image from 'next/image';
import styls from './components.module.css';
import Link from 'next/link';
import { Do_Hyeon } from "next/font/google";

interface Movie {
  id: string;
  title: string;
  posterPath: string;
}

const doHyeon = Do_Hyeon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default async function ImageTabs({ query, page }: { query: string, page: string }) {
  const data: Movie[] = await fetch(`${process.env.MOVIE_API}/api/streaming/page?query=${query}&page=${page}`, { cache: 'force-cache' }).then(res => res.json());

  return (
    <div className={styls.movieList}>
      {data.map((movie: Movie) => (
        <div key={movie.id} className={styls.movieItem}>
          <div className={styls.moviePosterContainer}>
            <Image 
              src={process.env.POSTER_URL + movie.posterPath} 
              alt={movie.title} 
              layout="fill"
              objectFit="cover"
              className={styls.moviePoster} 
            />
          </div>
          <Link href={`/movie/${movie.id}/${"streaming"}`} className={`${styls.movieTitle} ${doHyeon.className}`}>
            {movie.title}
          </Link>
        </div>
      ))}
    </div>
  );
}