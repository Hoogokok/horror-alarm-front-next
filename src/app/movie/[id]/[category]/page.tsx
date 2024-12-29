import Image from 'next/image';
import styles from "./page.module.css";
import PageTabs from "./components/PageTabs";
import { getUser } from "@/app/auth/lib/actions";
import localFont from 'next/font/local';
import { MovieDetailResponseDto } from '@/types/movie-detail-response-dto';
import { fetchMovieDetail } from "@/utils/api";
import { UserWithMovieIds } from '@/types/user';
const doHyeon = localFont({
  src: '../../../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

export default async function MovieDetail({ params }: { params: { id: string, category: string } }) {
  

  const movie: MovieDetailResponseDto = await fetchMovieDetail(params.category, params.id);

  const result: UserWithMovieIds = await getUser(); 

  return (
    <div className={styles.main}>
      <div className={styles.imagesection}>
        <Image src={process.env.POSTER_URL + movie.posterPath} alt={movie.title} width={263} height={394} className={styles.image} />
        <div className={styles.section}>
          <div className={styles.title} style={doHyeon.style}>{movie.title}</div>
          <div className={styles.info}>
            <PageTabs
              movie={movie}
              userWithMovieIds={result}
              category={params.category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

