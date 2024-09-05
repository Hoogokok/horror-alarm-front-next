import Image from 'next/image';
import styls from './components.module.css';


export default async function ImageTabs({ query, page }: { query: string, page: string }) {
  const data = await fetch(`${process.env.MOVIE_API}/api/streaming/page?query=${query}&page=${page}`, { cache: 'force-cache' }).then(res => res.json());
  return (
    <div className={styls.imagesection}>
      {data.map((movie: any) => (
        <div key={movie.id} className={styls.image}>
          <Image src={process.env.POSTER_URL + movie.posterPath} alt={movie.title} width={263} height={394}
          ></Image>
          <p>{movie.title}</p>
        </div>
      ))}
    </div>
  );
}