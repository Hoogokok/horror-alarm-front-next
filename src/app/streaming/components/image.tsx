
export default async function ImageTabs({ query, page }: { query: string, page: string }) {

  const data = await fetch(`${process.env.MOVIE_API}/api/streaming/page?query=${query}&page=${page}`).then(res => res.json());
  console.log(data);
  return (
    <div>
      {data.map((movie: any) => (
        <div key={movie.id}>
          <h1>
            {movie.title}
          </h1>
        </div>
      ))}
    </div>
  );
}