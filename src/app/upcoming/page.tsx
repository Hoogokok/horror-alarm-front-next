import { Suspense } from "react";

export default async function Upcoming() {
    const data = await fetch(process.env.MOVIE_API + '/api/upcoming', { cache: 'force-cache' }).then(res => res.json());

    return (
        <main>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <h1>개봉 예정 영화</h1>
                    <ul>
                        {data.map((movie: any) => (
                            <li key={movie.id}>
                                <img src={process.env.POSTER_URL + movie.posterPath} alt={movie.title} />
                                <h3>{movie.title}</h3>
                                <p>{movie.releaseDate}</p>
                                <p>{movie.overview}</p>
                                <p>{movie.theaters}</p>
                            </li>
                        ))}
                    </ul>
                </Suspense>
            </div>
        </main>
    );
}
