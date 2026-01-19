import React, { useId, useState } from "react";
import styles from "../styles/UseCaseCards.module.css";

const useCases = [
  {
    icon: "🎓",
    title: "Schools & Campuses",
    description: "Stay focused, free from social media distractions and ads, 100% online!"
  },
  {
    icon: "🏢",
    title: "Offices",
    description: "100% online, zero distractions. No social media, no ads!"
  },
  {
    icon: "🏘️",
    title: "Communities",
    description: "Private neighborhood chat, no ads, your data stays yours"
  },
  {
    icon: "🚌",
    title: "Commuters",
    description: "Stay connected on the move, no tracking, no data worries"
  },
  {
    icon: "🎪",
    title: "Events",
    description: "Coordinate gatherings privately, your conversations stay yours"
  },
  {
    icon: "🏭",
    title: "Factories",
    description: "Keep everyone connected without ads or social media noise"
  },
  {
    icon: "⛪",
    title: "Church Groups",
    description: "Connect your congregation privately, no ads or tracking"
  },
  {
    icon: "🌍",
    title: "Africa",
    description: "Africa needs Ziirroo Data to Chat!"
  }
];

function GridPattern({ width, height, x, y, squares, className }) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" className={className}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className={styles.gridOverflow}>
          {squares.map(([x, y], idx) => (
            <rect
              key={`${x}-${y}-${idx}`}
              strokeWidth="0"
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

function Grid({ pattern, size = 20 }) {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridGradient}>
        <GridPattern
          width={size}
          height={size}
          x="-12"
          y="4"
          squares={p}
          className={styles.gridPattern}
        />
      </div>
    </div>
  );
}

export default function UseCaseCards() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % useCases.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + useCases.length) % useCases.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* Desktop Grid View */}
      <div className={styles.container}>
        {useCases.map((useCase, index) => (
          <div
            key={useCase.title}
            className={`${styles.card} ${index === useCases.length - 1 ? styles.cardAfrica : ''}`}
          >
            <Grid size={20} />
            <div className={styles.icon}>{useCase.icon}</div>
            <h3 className={styles.title}>{useCase.title}</h3>
            <p className={styles.description}>{useCase.description}</p>
          </div>
        ))}
      </div>

      {/* Mobile Carousel View */}
      <div className={styles.carouselContainer}>
        <div className={styles.carouselWrapper}>
          <div 
            className={styles.carouselTrack}
            style={{ 
              transform: `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 2}rem))`,
              width: `calc(${useCases.length * 100}% + ${useCases.length * 2}rem)`
            }}
          >
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                className={`${styles.carouselCard} ${index === useCases.length - 1 ? styles.cardAfrica : ''}`}
              >
                <Grid size={20} />
                <div className={styles.icon}>{useCase.icon}</div>
                <h3 className={styles.title}>{useCase.title}</h3>
                <p className={styles.description}>{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className={styles.carouselControls}>
          <button 
            onClick={prevSlide} 
            className={styles.carouselArrow}
            aria-label="Previous slide"
          >
            ←
          </button>
          
          <div className={styles.carouselDots}>
            {useCases.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            className={styles.carouselArrow}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
