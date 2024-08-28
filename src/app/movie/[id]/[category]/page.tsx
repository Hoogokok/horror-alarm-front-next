import Image from 'next/image';
import styles from "./page.module.css";


export default async function MovieDetail({ params }: { params: { id: string, category: string } }) {
  const url = `${process.env.MOVIE_API}/api/movie/${params.id}?category=${params.category}`;
  const movie = await fetch(url).then(res => res.json());
  return (
    <div className={styles.main}>
      <div className={styles.title}>{movie.title}</div>
      <Image src={process.env.POSTER_URL + movie.posterPath} alt={movie.title} width={200} height={300} className={styles.image} />
      <div className={styles.overview}>{movie.overview}</div>
    </div>
  );
}