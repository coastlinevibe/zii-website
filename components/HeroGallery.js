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
    img: '/images/g1.jpg',
    title: 'Bridge',
    desc: 'A breathtaking view of a city illuminated by countless lights, showcasing the vibrant and bustling nightlife.',
    sliderName: 'bridge',
  },
  {
    img: '/images/g2.jpg',
    title: 'Mountains View',
    desc: 'A serene lake reflecting the surrounding mountains and trees, creating a mirror-like surface.',
    sliderName: 'mountains',
  },
  {
    img: '/images/g3.jpg',
    title: 'Autumn',
    desc: 'A picturesque path winding through a dense forest adorned with vibrant autumn foliage.',
    sliderName: 'autumn',
  },
  {
    img: '/images/g4.jpg',
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
                className={`${styles.sliderImage} ${styles[`image${index + 1}`]}`}
                src={item.img}
                width={1920}
                height={845}
                alt={item.desc}
              />
            </SliderWrapper>
          ))}
        </SliderContent>
        <ParticleText text="No Data? .. No Problem!" className={styles.particleOverlay} />
        <div className={styles.mzansiSmilesContainer}>
          <div className={styles.mzansiSmiles}>
            mzansi <span className={styles.smilesWithArrow}>smiles
              <img src="/images/sm1.png" alt="" className={styles.smileArrow} />
            </span>
          </div>
        </div>
        <div className={styles.ziiConnects}>Zii chat keeps you connected!</div>
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
