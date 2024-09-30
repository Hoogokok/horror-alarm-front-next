import Image from 'next/image';
import styls from './components.module.css';
import Link from 'next/link';
import localFont from 'next/font/local';

const doHyeon = localFont({
  src: '../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});
interface Movie {
  id: number;
  title: string;
  posterPath: string;
}

export default async function ImageTabs({ provider, page }: { provider: string, page: string }) {
  const data: Movie[] = await fetch(`${process.env.MOVIE_API}/movies/streaming?provider=${provider}&page=${page}`, { cache: 'force-cache' }).then(res => res.json());

  return (
    <div className={styls.movieList}>
      {data.map((movie: Movie) => (
        <div key={movie.id} className={styls.movieItem}>
          <div className={styls.moviePosterContainer}>
            <Image 
                src={process.env.POSTER_URL + movie.posterPath} 
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