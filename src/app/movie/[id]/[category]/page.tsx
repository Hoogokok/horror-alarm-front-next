import Image from 'next/image';
import styles from "./page.module.css";
import Tabs from "./components/tabs";
import { getUser } from "@/app/auth/lib/actions";
import localFont from 'next/font/local';

const doHyeon = localFont({
  src: '../../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default async function MovieDetail({ params }: { params: { id: string, category: string } }) {
  const url = `${process.env.MOVIE_API}/api/movie/${params.id}?category=${params.category}`;
  const movie = await fetch(url, { next: { revalidate: 3600 } }).then(res => res.json());
  const result = await getUser();
  return (
    <div className={styles.main}>
      <div className={styles.imagesection}>
        <Image src={process.env.POSTER_URL + movie.poster_path} alt={movie.title} width={263} height={394} className={styles.image} />
        <div className={styles.section}>
          <div className={styles.title} style={doHyeon.style}>{movie.title}</div>
          <div className={styles.info}>
            <Tabs movie={movie} user={result.user} rate_movieIds={result.rate_movieIds} review_movieIds={result.review_movieIds} category={params.category} />
          </div>
        </div>
      </div>
    </div>
  );
}