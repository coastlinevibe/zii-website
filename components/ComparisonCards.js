import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/ComparisonCards.module.css';

function GradientCard({ children, isZiiCard = false, autoHighlight = false }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / rect.height) * 5;
      const rotateY = (x / rect.width) * 5;
      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Auto-highlight for Zii card
  useEffect(() => {
    if (!autoHighlight) return;

    const interval = setInterval(() => {
      setIsHovered(true);
      setTimeout(() => setIsHovered(false), 2000);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoHighlight]);

  const glowColors = isZiiCard
    ? {
        primary: 'rgba(191, 255, 0, 0.7)',
        secondary: 'rgba(139, 255, 50, 0.7)',
        center: 'rgba(191, 255, 0, 0.7)',
        border: 'rgba(191, 255, 0, 0.7)',
      }
    : {
        primary: 'rgba(239, 68, 68, 0.7)',
        secondary: 'rgba(185, 28, 28, 0.7)',
        center: 'rgba(239, 68, 68, 0.7)',
        border: 'rgba(239, 68, 68, 0.7)',
      };

  return (
    <motion.div
      ref={cardRef}
      className={styles.card}
      initial={{ y: 0 }}
      animate={{
        y: isHovered ? -5 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Glass reflection overlay */}
      <motion.div
        className={styles.glassReflection}
        animate={{
          opacity: isHovered ? 0.7 : 0.5,
          rotateX: -rotation.x * 0.2,
          rotateY: -rotation.y * 0.2,
          z: 1,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Dark background */}
      <motion.div
        className={styles.darkBackground}
        animate={{
          z: -1,
        }}
      />

      {/* Noise texture */}
      <motion.div
        className={styles.noiseTexture}
        animate={{
          z: -0.5,
        }}
      />

      {/* Smudge texture */}
      <motion.div
        className={styles.smudgeTexture}
        animate={{
          z: -0.25,
        }}
      />

      {/* Purple/blue glow effect */}
      <motion.div
        className={styles.gradientGlow}
        style={{
          background: `radial-gradient(ellipse at bottom right, ${glowColors.primary} -10%, rgba(79, 70, 229, 0) 70%),
                       radial-gradient(ellipse at bottom left, ${glowColors.secondary} -10%, rgba(79, 70, 229, 0) 70%)`,
        }}
        animate={{
          opacity: isHovered ? 0.9 : 0.8,
          y: isHovered ? rotation.x * 0.5 : 0,
          z: 0,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Central glow */}
      <motion.div
        className={styles.centralGlow}
        style={{
          background: `radial-gradient(circle at bottom center, ${glowColors.center} -20%, rgba(79, 70, 229, 0) 60%)`,
        }}
        animate={{
          opacity: isHovered ? 0.85 : 0.75,
          y: isHovered ? `calc(10% + ${rotation.x * 0.3}px)` : '10%',
          z: 0,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Bottom border glow */}
      <motion.div
        className={styles.bottomBorder}
        style={{
          background: isZiiCard
            ? 'linear-gradient(90deg, rgba(191, 255, 0, 0.05) 0%, rgba(191, 255, 0, 0.7) 50%, rgba(191, 255, 0, 0.05) 100%)'
            : 'linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.7) 50%, rgba(239, 68, 68, 0.05) 100%)',
        }}
        animate={{
          boxShadow: isHovered
            ? isZiiCard
              ? '0 0 20px 4px rgba(191, 255, 0, 0.9), 0 0 30px 6px rgba(139, 255, 50, 0.7), 0 0 40px 8px rgba(191, 255, 0, 0.5)'
              : '0 0 20px 4px rgba(239, 68, 68, 0.9), 0 0 30px 6px rgba(185, 28, 28, 0.7), 0 0 40px 8px rgba(239, 68, 68, 0.5)'
            : isZiiCard
            ? '0 0 15px 3px rgba(191, 255, 0, 0.8), 0 0 25px 5px rgba(139, 255, 50, 0.6), 0 0 35px 7px rgba(191, 255, 0, 0.4)'
            : '0 0 15px 3px rgba(239, 68, 68, 0.8), 0 0 25px 5px rgba(185, 28, 28, 0.6), 0 0 35px 7px rgba(239, 68, 68, 0.4)',
          opacity: isHovered ? 1 : 0.9,
          z: 0.5,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Left corner glow */}
      <motion.div
        className={styles.leftCorner}
        animate={{
          boxShadow: isHovered
            ? isZiiCard
              ? '0 0 20px 4px rgba(191, 255, 0, 0.9), 0 0 30px 6px rgba(139, 255, 50, 0.7), 0 0 40px 8px rgba(191, 255, 0, 0.5)'
              : '0 0 20px 4px rgba(239, 68, 68, 0.9), 0 0 30px 6px rgba(185, 28, 28, 0.7), 0 0 40px 8px rgba(239, 68, 68, 0.5)'
            : isZiiCard
            ? '0 0 15px 3px rgba(191, 255, 0, 0.8), 0 0 25px 5px rgba(139, 255, 50, 0.6), 0 0 35px 7px rgba(191, 255, 0, 0.4)'
            : '0 0 15px 3px rgba(239, 68, 68, 0.8), 0 0 25px 5px rgba(185, 28, 28, 0.6), 0 0 35px 7px rgba(239, 68, 68, 0.4)',
          opacity: isHovered ? 1 : 0.9,
          z: 0.5,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Left edge glow */}
      <motion.div
        className={styles.leftEdge}
        animate={{
          boxShadow: isHovered
            ? isZiiCard
              ? '0 0 20px 4px rgba(191, 255, 0, 0.9), 0 0 30px 6px rgba(139, 255, 50, 0.7), 0 0 40px 8px rgba(191, 255, 0, 0.5)'
              : '0 0 20px 4px rgba(239, 68, 68, 0.9), 0 0 30px 6px rgba(185, 28, 28, 0.7), 0 0 40px 8px rgba(239, 68, 68, 0.5)'
            : isZiiCard
            ? '0 0 15px 3px rgba(191, 255, 0, 0.8), 0 0 25px 5px rgba(139, 255, 50, 0.6), 0 0 35px 7px rgba(191, 255, 0, 0.4)'
            : '0 0 15px 3px rgba(239, 68, 68, 0.8), 0 0 25px 5px rgba(185, 28, 28, 0.6), 0 0 35px 7px rgba(239, 68, 68, 0.4)',
          opacity: isHovered ? 1 : 0.9,
          z: 0.5,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Right corner glow */}
      <motion.div
        className={styles.rightCorner}
        animate={{
          boxShadow: isHovered
            ? isZiiCard
              ? '0 0 20px 4px rgba(191, 255, 0, 0.9), 0 0 30px 6px rgba(139, 255, 50, 0.7), 0 0 40px 8px rgba(191, 255, 0, 0.5)'
              : '0 0 20px 4px rgba(239, 68, 68, 0.9), 0 0 30px 6px rgba(185, 28, 28, 0.7), 0 0 40px 8px rgba(239, 68, 68, 0.5)'
            : isZiiCard
            ? '0 0 15px 3px rgba(191, 255, 0, 0.8), 0 0 25px 5px rgba(139, 255, 50, 0.6), 0 0 35px 7px rgba(191, 255, 0, 0.4)'
            : '0 0 15px 3px rgba(239, 68, 68, 0.8), 0 0 25px 5px rgba(185, 28, 28, 0.6), 0 0 35px 7px rgba(239, 68, 68, 0.4)',
          opacity: isHovered ? 1 : 0.9,
          z: 0.5,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Right edge glow */}
      <motion.div
        className={styles.rightEdge}
        animate={{
          boxShadow: isHovered
            ? isZiiCard
              ? '0 0 20px 4px rgba(191, 255, 0, 0.9), 0 0 30px 6px rgba(139, 255, 50, 0.7), 0 0 40px 8px rgba(191, 255, 0, 0.5)'
              : '0 0 20px 4px rgba(239, 68, 68, 0.9), 0 0 30px 6px rgba(185, 28, 28, 0.7), 0 0 40px 8px rgba(239, 68, 68, 0.5)'
            : isZiiCard
            ? '0 0 15px 3px rgba(191, 255, 0, 0.8), 0 0 25px 5px rgba(139, 255, 50, 0.6), 0 0 35px 7px rgba(191, 255, 0, 0.4)'
            : '0 0 15px 3px rgba(239, 68, 68, 0.8), 0 0 25px 5px rgba(185, 28, 28, 0.6), 0 0 35px 7px rgba(239, 68, 68, 0.4)',
          opacity: isHovered ? 1 : 0.9,
          z: 0.5,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      />

      {/* Content */}
      <motion.div
        className={styles.cardContent}
        animate={{
          z: 2,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function ComparisonCards() {
  return (
    <div className={styles.container}>
      <GradientCard isZiiCard={false}>
        <h3 className={styles.cardTitle}>❌ Traditional Apps</h3>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.icon}>✗</span>
            <span>Need constant data</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.icon}>✗</span>
            <span>Expensive monthly costs</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.icon}>✗</span>
            <span>Track your activity</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.icon}>✗</span>
            <span>Sell your data</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.icon}>✗</span>
            <span>Centralized servers</span>
          </li>
        </ul>
      </GradientCard>

      <GradientCard isZiiCard={true} autoHighlight={true}>
        <h3 className={styles.cardTitle}>
          ✅ <span className={styles.ziiText}>Zii</span> Chat
        </h3>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.iconCheck}>✓</span>
            <span>Works offline via Bluetooth</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.iconCheck}>✓</span>
            <span>Affordable one-time codes</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.iconCheck}>✓</span>
            <span>No tracking, ever</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.iconCheck}>✓</span>
            <span>Your data stays yours</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.iconCheck}>✓</span>
            <span>Decentralized network</span>
          </li>
        </ul>
      </GradientCard>
    </div>
  );
}
