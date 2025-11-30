import React, { useState, useEffect } from 'react';
import styles from '../styles/StaggerTestimonials.module.css';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "Finally! A chat app that doesn't eat my data. Perfect for when my data is finished.",
    by: "Thabo M., Johannesburg",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    tempId: 1,
    testimonial: "Love the privacy features. No more worrying about who's reading my messages.",
    by: "Sarah K., Cape Town",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 2,
    testimonial: "Our whole campus uses it now. Bluetooth mesh is genius!",
    by: "David N., Durban",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    tempId: 3,
    testimonial: "Zii Chat saved me so much money on data. I can chat all day without stress!",
    by: "Lerato P., Pretoria",
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    tempId: 4,
    testimonial: "Best app for staying connected with my church group. No data needed!",
    by: "Pastor John, Port Elizabeth",
    imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    tempId: 5,
    testimonial: "My factory team stays connected without burning through airtime. Lekka!",
    by: "Sipho M., Bloemfontein",
    imgSrc: "https://i.pravatar.cc/150?img=8"
  },
  {
    tempId: 6,
    testimonial: "Location channels are amazing! I found my neighbors and we chat daily.",
    by: "Zanele T., Soweto",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    tempId: 7,
    testimonial: "I was skeptical at first, but now I can't imagine life without Zii Chat!",
    by: "Michael B., East London",
    imgSrc: "https://i.pravatar.cc/150?img=10"
  },
  {
    tempId: 8,
    testimonial: "The offline feature is a game changer. I chat on the taxi without data!",
    by: "Nomsa D., Pietermaritzburg",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    tempId: 9,
    testimonial: "Zii Chat is chisa! My whole squad is on it now. 🔥",
    by: "Tshepo L., Sandton",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    tempId: 10,
    testimonial: "I've been searching for something like this for years. So glad I found Zii!",
    by: "Precious N., Polokwane",
    imgSrc: "https://i.pravatar.cc/150?img=13"
  },
  {
    tempId: 11,
    testimonial: "Simple to use and my battery lasts all day. Perfect!",
    by: "Andile K., Nelspruit",
    imgSrc: "https://i.pravatar.cc/150?img=14"
  },
  {
    tempId: 12,
    testimonial: "Customer support is amazing. They helped me set up in minutes!",
    by: "Fatima A., Rustenburg",
    imgSrc: "https://i.pravatar.cc/150?img=15"
  },
  {
    tempId: 13,
    testimonial: "The mesh network is incredible. Messages travel so far!",
    by: "Chris V., George",
    imgSrc: "https://i.pravatar.cc/150?img=16"
  },
  {
    tempId: 14,
    testimonial: "Zii Chat has changed how we communicate at events. No more data stress!",
    by: "Lindiwe S., Kimberley",
    imgSrc: "https://i.pravatar.cc/150?img=17"
  },
  {
    tempId: 15,
    testimonial: "R15 for 30 days? That's nothing compared to what I was spending on data!",
    by: "Bongani H., Mafikeng",
    imgSrc: "https://i.pravatar.cc/150?img=18"
  },
  {
    tempId: 16,
    testimonial: "I love that my messages are encrypted. Privacy matters!",
    by: "Ayanda M., Richards Bay",
    imgSrc: "https://i.pravatar.cc/150?img=19"
  },
  {
    tempId: 17,
    testimonial: "The ROI is insane. I've saved hundreds on data costs already!",
    by: "Thandi G., Upington",
    imgSrc: "https://i.pravatar.cc/150?img=20"
  },
  {
    tempId: 18,
    testimonial: "Robust yet easy to use. My gogo even figured it out!",
    by: "Mandla W., Vereeniging",
    imgSrc: "https://i.pravatar.cc/150?img=21"
  },
  {
    tempId: 19,
    testimonial: "We've tried everything, but Zii Chat is the most reliable. Hands down.",
    by: "Nkosi R., Mbombela",
    imgSrc: "https://i.pravatar.cc/150?img=22"
  }
];

function TestimonialCard({ position, testimonial, handleMove, cardSize }) {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={`${styles.card} ${isCenter ? styles.cardCenter : styles.cardSide}`}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `translate(-50%, -50%) translateX(${(cardSize / 1.5) * position}px) translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(191, 255, 0, 0.3)" : "0px 0px 0px 0px transparent"
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
      <h3 className={styles.testimonialText}>
        "{testimonial.testimonial}"
      </h3>
      <p className={styles.author}>
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
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const matches = window.matchMedia("(min-width: 640px)").matches;
      setCardSize(matches ? 365 : 290);
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
