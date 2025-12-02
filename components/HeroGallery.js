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
    title: 'Chat Offline',
    desc: 'Connect via Bluetooth mesh network. No data, no stress!',
    sliderName: 'bridge',
  },
  {
    img: '/images/g2.jpg',
    title: 'Location Channels',
    desc: 'Join chat channels based on your location when online.',
    sliderName: 'mountains',
  },
  {
    img: '/images/g3.jpg',
    title: 'Private & Encrypted',
    desc: 'End-to-end encryption. No tracking. No servers.',
    sliderName: 'autumn',
  },
  {
    img: '/images/g4.jpg',
    title: 'Decentralized',
    sliderName: 'foggy',
    desc: 'No company controls your messages. True freedom.',
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
