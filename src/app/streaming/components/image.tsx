import Image from 'next/image';
import styls from './components.module.css';
import Link from 'next/link';
import { Do_Hyeon } from "next/font/google";

interface Movie {
  id: string;
  title: string;
  poster_path: string;
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
                src={process.env.POSTER_URL + movie.poster_path} 
              alt={movie.title} 
              className={styls.moviePoster} 
              width={100}
              height={100}
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