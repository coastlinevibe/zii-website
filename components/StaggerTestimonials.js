import React, { useState, useEffect } from 'react';
import styles from '../styles/StaggerTestimonials.module.css';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    colorId: 0,
    testimonial: "Finally! A chat app that doesn't eat my data. Perfect for when my data is finished.",
    by: "Thabo M., Johannesburg",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    tempId: 1,
    colorId: 1,
    testimonial: "Love the privacy features. No more worrying about who's reading my messages.",
    by: "Sarah K., Cape Town",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 2,
    colorId: 2,
    testimonial: "Our whole campus uses it now. Bluetooth mesh is genius!",
    by: "David N., Durban",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    tempId: 3,
    colorId: 3,
    testimonial: "Zii Chat saved me so much money on data. I can chat all day without stress!",
    by: "Lerato P., Pretoria",
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    tempId: 4,
    colorId: 0,
    testimonial: "Best app for staying connected with my church group. No data needed!",
    by: "Pastor John, Port Elizabeth",
    imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    tempId: 5,
    colorId: 1,
    testimonial: "My factory team stays connected without burning through airtime. Lekka!",
    by: "Sipho M., Bloemfontein",
    imgSrc: "https://i.pravatar.cc/150?img=8"
  },
  {
    tempId: 6,
    colorId: 2,
    testimonial: "Location channels are amazing! I found my neighbors and we chat daily.",
    by: "Zanele T., Soweto",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    tempId: 7,
    colorId: 3,
    testimonial: "I was skeptical at first, but now I can't imagine life without Zii Chat!",
    by: "Michael B., East London",
    imgSrc: "https://i.pravatar.cc/150?img=10"
  },
  {
    tempId: 8,
    colorId: 0,
    testimonial: "The offline feature is a game changer. I chat on the taxi without data!",
    by: "Nomsa D., Pietermaritzburg",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    tempId: 9,
    colorId: 1,
    testimonial: "Zii Chat is chisa! My whole squad is on it now. 🔥",
    by: "Tshepo L., Sandton",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },

];

function TestimonialCard({ position, testimonial, handleMove, cardSize }) {
  const isCenter = position === 0;
  
  const colors = [
    { bg: 'linear-gradient(135deg, #FF006B 0%, #E91E63 100%)', text: '#fff' }, // Pink
    { bg: 'linear-gradient(135deg, #BFFF00 0%, #A4E800 100%)', text: '#0a0a0a' }, // Lime
    { bg: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)', text: '#fff' }, // Orange
    { bg: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)', text: '#fff' }, // Cyan
  ];
  
  const cardColor = colors[testimonial.colorId];

  return (
    <div
      onClick={() => handleMove(position)}
      className={`${styles.card} ${isCenter ? styles.cardCenter : styles.cardSide}`}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `translate(-50%, -50%) translateX(${(cardSize / 1.5) * position}px) translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(191, 255, 0, 0.3)" : "0px 0px 0px 0px transparent",
        background: isCenter ? cardColor.bg : 'rgba(0, 0, 0, 0.9)',
        color: isCenter ? cardColor.text : 'white'
      }}
    >
      <span
        className={styles.cornerLine}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(',')[0]}
        className={styles.avatar}
      />
      <h3 className={styles.testimonialText} style={{ color: isCenter ? cardColor.text : 'white' }}>
        "{testimonial.testimonial}"
      </h3>
      <p className={styles.author} style={{ color: isCenter ? (cardColor.text === '#fff' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)') : 'rgba(255, 255, 255, 0.6)' }}>
        - {testimonial.by}
      </p>
    </div>
  );
}

export default function StaggerTestimonials() {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps) => {
    const newList = [...testimonialsList];
    
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random(), colorId: item.colorId });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random(), colorId: item.colorId });
      }
    }
    
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const matches = window.matchMedia("(min-width: 640px)").matches;
      setCardSize(matches ? 182 : 145);
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className={styles.container}>
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      
      <div className={styles.controls}>
        <button
          onClick={() => handleMove(-1)}
          className={styles.controlButton}
          aria-label="Previous testimonial"
        >
          ‹
        </button>
        <button
          onClick={() => handleMove(1)}
          className={styles.controlButton}
          aria-label="Next testimonial"
        >
          ›
        </button>
      </div>
    </div>
  );
}
