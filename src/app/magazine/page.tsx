import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import localFont from 'next/font/local';

export interface Article {
  title: string;
  url: string;
  imageUrl: string;
  author?: string;
  excerpt?: string;
}

const doHyeon = localFont({
  src: '../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

async function fetchArticles(): Promise<Article[]> {
  try {
    const now = Date.now();
    const refreshInterval = 24 * 60 * 60 * 1000; // 24시간을 밀리초로 변환
    const shouldRefresh = now % refreshInterval < 60000; // 24시간마다 1분 동안 refresh를 true로 설정

    const url = new URL(`${process.env.NEXT_PUBLIC_MAGAZINE_PROXY}/api/fangoria-articles`);
    if (shouldRefresh) {
      url.searchParams.append('refresh', 'true');
    }

    const response = await fetch(url.toString(), { 
      next: { revalidate: 86400 } // 24시간마다 재검증
    });

    if (!response.ok) {
      throw new Error('기사를 가져오는데 실패했습니다');
    }
    return response.json();
  } catch (error) {
    console.error('기사를 가져오는 중 오류 발생:', error);
    return [];
  }
}

export default async function MagazinePage() {
  const articles = await fetchArticles();

  return (
    <div className={styles['magazine-container']} style={doHyeon.style}>
      <h1 className={styles['magazine-title']}>Fangoria</h1>
      <div className={styles['articles-grid']}>
        {articles.map((article, index) => (
          <div key={index} className={styles['article-card']}>
            {article.imageUrl && (
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={200}
                height={150}
                className={styles['article-image']}
              />
            )}
            <div className={styles['article-content']}>
              <Link href={article.url}>
                <h2 className={styles['article-title']}>{article.title}</h2>
              </Link>
              {article.author && <p className={styles['article-author']}>BY {article.author.toUpperCase()}</p>}
              {article.excerpt && <p className={styles['article-excerpt']}>{article.excerpt}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
