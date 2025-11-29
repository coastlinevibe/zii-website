import Image from 'next/image';
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from './ProgressiveCarousel';
import ParticleText from './ParticleText';
import styles from '../styles/HeroGallery.module.css';

const items = [
  {
    img: 'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1170&auto=format&fit=crop',
    title: 'Bridge',
    desc: 'A breathtaking view of a city illuminated by countless lights, showcasing the vibrant and bustling nightlife.',
    sliderName: 'bridge',
  },
  {
    img: 'https://images.unsplash.com/photo-1518972734183-c5b490a7c637?q=80&w=1170&auto=format&fit=crop',
    title: 'Mountains View',
    desc: 'A serene lake reflecting the surrounding mountains and trees, creating a mirror-like surface.',
    sliderName: 'mountains',
  },
  {
    img: 'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1170&auto=format&fit=crop',
    title: 'Autumn',
    desc: 'A picturesque path winding through a dense forest adorned with vibrant autumn foliage.',
    sliderName: 'autumn',
  },
  {
    img: 'https://images.unsplash.com/photo-1628965882741-570e75becd5d?q=80&w=687&auto=format&fit=crop',
    title: 'Foggy',
    sliderName: 'foggy',
    desc: 'A stunning foggy view over the forest, with the sun casting a golden glow across the forest.',
  },
];

export default function HeroGallery() {
  return (
    <div className={styles.galleryContainer}>
      <ProgressSlider vertical={false} activeSlider='bridge' className={styles.slider}>
        <SliderContent>
          {items.map((item, index) => (
            <SliderWrapper key={index} value={item.sliderName}>
              <Image
                className={styles.sliderImage}
                src={item.img}
                width={1900}
                height={1080}
                alt={item.desc}
              />
            </SliderWrapper>
          ))}
        </SliderContent>
        <ParticleText text="No Data? No Problem!" className={styles.particleOverlay} />
        <SliderBtnGroup className={styles.btnGroup}>
          {items.map((item, index) => (
            <SliderBtn
              key={index}
              value={item.sliderName}
              className={styles.sliderBtn}
              progressBarClass={styles.progressBar}
            >
              <h2 className={styles.btnTitle}>{item.title}</h2>
              <p className={styles.btnDesc}>{item.desc}</p>
            </SliderBtn>
          ))}
        </SliderBtnGroup>
      </ProgressSlider>
    </div>
  );
}
