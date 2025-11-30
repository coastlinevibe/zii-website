import React from 'react';
import styles from '../styles/PacmanAnimation.module.css';

export default function PacmanAnimation() {
  return (
    <div className={styles.container}>
      {/* Round 1: FREE words */}
      <div className={styles.track} data-round="1">
        <div className={styles.pacman}>
          <div className={styles.pacmanTop}></div>
          <div className={styles.pacmanBottom}></div>
        </div>
        
        <span className={styles.word} data-index="0">FREE</span>
        <span className={styles.word} data-index="1">FREE</span>
        <span className={styles.word} data-index="2">FREE</span>
        <span className={styles.word} data-index="3">FREE</span>
        <span className={styles.word} data-index="4">FREE</span>
        <span className={styles.word} data-index="5">FREE</span>
        <span className={styles.word} data-index="6">FREE</span>
        <span className={styles.word} data-index="7">FREE</span>
      </div>
      
      {/* Round 2: Ziirroo data to chat */}
      <div className={styles.track} data-round="2">
        <div className={styles.pacman}>
          <div className={styles.pacmanTop}></div>
          <div className={styles.pacmanBottom}></div>
        </div>
        
        <span className={styles.word} data-index="0"><span className={styles.zii}>Ziirroo</span></span>
        <span className={styles.word} data-index="1">data</span>
        <span className={styles.word} data-index="2">to</span>
        <span className={styles.word} data-index="3">chat</span>
        <span className={styles.word} data-index="4"><span className={styles.zii}>Ziirroo</span></span>
        <span className={styles.word} data-index="5">data</span>
        <span className={styles.word} data-index="6">to</span>
        <span className={styles.word} data-index="7">chat</span>
      </div>
    </div>
  );
}
