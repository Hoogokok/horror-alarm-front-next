import Image from 'next/image';
import styles from "./page.module.css";
import PageTabs from "./components/tabs";
import { getUser } from "@/app/auth/lib/actions";
import localFont from 'next/font/local';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';

const doHyeon = localFont({
  src: '../../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default async function MovieDetail({ params }: { params: { id: string, category: string } }) {
  let url: string;

  switch (params.category) {
    case 'streaming':
      url = `${process.env.MOVIE_API}/movies/streaming/${params.id}`;
      break;
    case 'upcoming':
    case 'released':
      url = `${process.env.MOVIE_API}/movies/theater/${params.id}`;
      break;
    case 'expiring':
      url = `${process.env.MOVIE_API}/movies/expiring-horror/${params.id}`;
      break;
    default:
      throw new Error('Invalid category');
  }

  const movie: MovieDetailResponseDto = await fetch(url, { 
    next: { revalidate: 3600 },
    headers: {
      'X-API-Key': process.env.MOVIE_API_KEY as string
    }
  }).then(res => res.json());
  const result = await getUser();

  return (
    <div className={styles.main}>
      <div className={styles.imagesection}>
        <Image src={process.env.POSTER_URL + movie.posterPath} alt={movie.title} width={263} height={394} className={styles.image} />
        <div className={styles.section}>
          <div className={styles.title} style={doHyeon.style}>{movie.title}</div>
          <div className={styles.info}>
            <PageTabs movie={movie} user={result.user} rate_movieIds={result.rate_movieIds} review_movieIds={result.review_movieIds} category={params.category} />
          </div>
        </div>
      </div>
    </div>
  );
}