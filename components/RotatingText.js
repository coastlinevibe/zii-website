import React, { useState, useEffect } from 'react';
import styles from '../styles/RotatingText.module.css';

const words = ['Zero Limits', 'Zero Stress', 'Ziirroo Data'];

export default function RotatingText() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <div className={styles.container}>
      <span className={styles.coinWrapper}>
        <span className={styles.coin}>50c</span>
      </span>
      <span className={styles.staticText}>a day keeps you chatting Mzansi way,</span>
      <span className={styles.highlight}>
        {displayText}
        <span className={styles.cursor}>|</span>
      </span>
    </div>
  );
}
