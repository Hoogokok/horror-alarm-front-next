import styles from "./page.module.css";
import Link from 'next/link'
import Image from 'next/image'

const imageStyle = {
  padding: '10px',
  borderRadius: '20px',
}

export default function Home() {
  return (
    <main className={styles.main}>
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li className={styles.menu}>
            <Link href="/upcoming">
              개봉 예정 영화
            </Link>
          </li>
          <li className={styles.menu}>
            <Link href="/now-playing">
              현재 상영 중인 영화
            </Link>
          </li>
          <li className={styles.menu}>
            <Link href="/streaming">
              스트리밍 종료 예정 영화
            </Link>
          </li>
          <li className={styles.menu}>
            <Link href="/top-rated">
              인기 있는 영화
            </Link>
          </li>
          <li className={styles.menu}>
            로그인 / 회원가입
          </li>
        </ul>
      </nav>
      <div className={styles.content}>
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
      </div>
      <div className={styles.content}>
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
      </div>
      <div className={styles.content}>
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
        <Image
          alt="개봉 예정 영화"
          src={process.env.POSTER_URL + '/gwk23mfvbNzh0zqygZChXlqHbnq.jpg'}
          width={250}
          height={300}
          style={imageStyle}
        />
      </div>
    </main>
  );
}
