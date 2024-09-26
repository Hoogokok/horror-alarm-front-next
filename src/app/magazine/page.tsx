import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import localFont from 'next/font/local';

export interface Article {
  title: string;
  url: string;
  imageUrl: string;
  author?: string;
  source: string;
}

const doHyeon = localFont({
  src: '../fonts/DoHyeon-Regular.ttf',
  display: 'swap',
});

async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MAGAZINE_PROXY}/api/articles`, { cache: 'no-store' });
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
