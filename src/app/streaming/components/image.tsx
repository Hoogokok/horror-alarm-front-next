import Image from 'next/image';


export default async function ImageTabs({ query, page }: { query: string, page: string }) {
  const data = await fetch(`${process.env.MOVIE_API}/api/streaming/page?query=${query}&page=${page}`).then(res => res.json());
  return (
    <div>
      {data.map((movie: any) => (
        <div key={movie.id}>
          <Image src={process.env.POSTER_URL + movie.posterPath} alt={movie.title} width={263} height={394}
          ></Image>
          <p>{movie.title}</p>
        </div>
      ))}
    </div>
  );
}