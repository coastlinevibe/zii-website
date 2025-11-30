import React, { useId } from "react";
import styles from "../styles/UseCaseCards.module.css";

const useCases = [
  {
    icon: "🎓",
    title: "Students",
    description: "Stay connected on campus without burning through data"
  },
  {
    icon: "🏢",
    title: "Offices",
    description: "Team communication without internet dependency"
  },
  {
    icon: "🏘️",
    title: "Communities",
    description: "Neighborhood chat and local updates"
  },
  {
    icon: "🚌",
    title: "Commuters",
    description: "Chat on the go without worrying about data"
  },
  {
    icon: "🏕️",
    title: "Events",
    description: "Coordinate at festivals, conferences, gatherings"
  },
  {
    icon: "🏭",
    title: "Factories",
    description: "Keep teams connected on the floor without data costs"
  },
  {
    icon: "⛪",
    title: "Church Groups",
    description: "Stay in touch with your congregation and community"
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
  return (
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
  );
}
