'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from "./components.module.css";

const POSTER_URL = 'https://image.tmdb.org/t/p/w500';

export default function ImageTabs({ initialMovies }: { initialMovies: any[] }) {
  const [activeTab, setActiveTab] = useState('netflix');
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState(initialMovies);
  const imagesPerPage = 6;

  const fetchMoreMovies = async () => {
    console.log('fetch more movies');
    const nextPage = Math.ceil(movies.length / imagesPerPage) + 1;
    const id = activeTab === 'netflix' ? 1 : 2;
    const newMovies = await fetch(`${process.env.MOVIE_API}/api/streaming/${id}?page=${nextPage}`, { cache: "force-cache" }).then(res => res.json());
    const updatedMovies = movies.concat(newMovies.map((movie: any) => ({ ...movie, platform: activeTab })));
    setMovies(updatedMovies);
  };

  const filteredMovies = movies.filter(movie => movie.platform === activeTab);
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredMovies.slice(indexOfFirstImage, indexOfLastImage);

  const renderImages = () => {
    return (
      <div className={styles.imageGallery}>
        {currentImages.map((movie, index) => (
          <div key={index} className={styles.imageItem}>
            <Image
              src={`${POSTER_URL}${movie.posterPath}`}
              alt={movie.title}
              width={150}
              height={225}
              className={styles.image}
            />
            <div className={styles.imageTitle}>{movie.title}</div>
          </div>
        ))}
      </div>
    );
  };

  const totalPages = Math.ceil(filteredMovies.length / imagesPerPage);

  const handleNextPage = async () => {
    if (currentPage === totalPages) {
      await fetchMoreMovies();
    }
    setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('netflix')} className={activeTab === 'netflix' ? styles.activeTab : ''}>
          넷플릭스
        </button>
        <button onClick={() => setActiveTab('disney')} className={activeTab === 'disney' ? styles.activeTab : ''}>
          디즈니 플러스
        </button>
      </div>
      <div className={styles.tabContent}>
        {renderImages()}
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages && filteredMovies.length < movies.length}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}