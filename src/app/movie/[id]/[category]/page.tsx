import Image from 'next/image';
import styles from "./page.module.css";
import Tabs from "./components/tabs";
import { getUser } from "@/app/auth/lib/actions";
import supabase from "@/app/utils/supabase/client";

export default async function MovieDetail({ params }: { params: { id: string, category: string } }) {
  const url = `${process.env.MOVIE_API}/api/movie/${params.id}?category=${params.category}`;
  const movie = await fetch(url, { cache: "force-cache" }).then(res => res.json());
  const result = await getUser();
  return (
    <div className={styles.main}>
      <div className={styles.imagesection}>
        <Image src={process.env.POSTER_URL + movie.posterPath} alt={movie.title} width={263} height={394} className={styles.image} />
        <div className={styles.section}>
          <div className={styles.title}>{movie.title}</div>
          <div className={styles.info}>
            <Tabs movie={movie} user={result.user} movieIds={result.movieIds} category={params.category} />
          </div>
        </div>
      </div>
    </div>
  );
}