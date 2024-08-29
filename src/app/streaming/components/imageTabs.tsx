'use client';

import { useState } from 'react';
import styles from "./components.module.css";
import Image from 'next/image';
const POSTER_URL = 'https://image.tmdb.org/t/p/w500';

export default function ImageTabs({ movies }: { movies: any[] }) {
    const [activeTab, setActiveTab] = useState('netflix');

    const renderImages = () => {
        const filteredMovies = movies.filter(movie => movie.platform === activeTab);
        return (
          <div className={styles.imageGallery}>
            {filteredMovies.map((movie, index) => (
              <div key={index} className={styles.imageItem}>
                <Image
                  alt={movie.title}
                  src={`${POSTER_URL}${movie.posterPath}`}                 
                   width={250}
                  height={300}
                  className={styles.image}
                />
                <div className={styles.imageTitle}>{movie.title}</div>
              </div>
            ))}
          </div>
        );
      };
    
        return (
            <div>
            <div className={styles.tab}>
                <button
                className={activeTab === 'netflix' ? styles.active : ''}
                onClick={() => setActiveTab('netflix')}
                >
                넷플릭스
                </button>
                <button
                className={activeTab === 'disney' ? styles.active : ''}
                onClick={() => setActiveTab('disney')}
                >
                디즈니
                </button>
            </div>
            {renderImages()}
            </div>
        );
}