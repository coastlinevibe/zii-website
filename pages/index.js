import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import HeroGallery from '../components/HeroGallery';
import RotatingText from '../components/RotatingText';
import PacmanAnimation from '../components/PacmanAnimation';
import FAQWithSpiral from '../components/FAQWithSpiral';
import StaggerTestimonials from '../components/StaggerTestimonials';
import UseCaseCards from '../components/UseCaseCards';
import ComparisonCards from '../components/ComparisonCards';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Trigger Tenor embed script
    if (typeof window !== 'undefined' && window.TenorEmbed) {
      window.TenorEmbed.mount();
    }

    // Show/hide scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <Head>
        <title>Zii Chat - Data Freedom, Ziirroo Stress!</title>
        <meta name="description" content="Chat offline via Bluetooth. Connect by location online. No data needed!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <Script 
        src="https://tenor.com/embed.js" 
        strategy="afterInteractive"
        onLoad={() => {
          if (window.TenorEmbed) {
            window.TenorEmbed.mount();
          }
        }}
      />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          {/* Gallery Component with Particle Text Overlay */}
          <div className={styles.heroMiddle}>
            <HeroGallery />
          </div>

          {/* BOTTOM - Tagline and CTA Buttons */}
          <div className={styles.heroBottom}>
            <RotatingText />
            
            <div className={styles.ctaButtons}>
              <a href="/download" className={styles.primaryButton}>
                Download Now
              </a>
              <a href="/buy" className={styles.secondaryButton}>
                Grab Your Code
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2>How <span className={styles.ziiText}>Zii</span> Chat <span className={styles.rollsText}>R<img src="/images/ww.png" alt="O" className={styles.rollingTyre} />LLS</span></h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3>Chat Offline</h3>
              <p>Connect via Bluetooth mesh network. No data, no stress!</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📍</div>
              <h3>Location Channels</h3>
              <p>Join chat channels based on your location when online.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Private & Encrypted</h3>
              <p>End-to-end encryption. No tracking. No servers.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌍</div>
              <h3>Decentralized</h3>
              <p>No company controls your messages. True freedom.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className={styles.pricing}>
          <h2><img src="/images/rb2.png" alt="rugby" className={styles.ballIcon} /> Lekka Deals <img src="/images/sb2.png" alt="soccer" className={styles.soccerIcon} /></h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>10 Days</h3>
              <div className={styles.price}>R5</div>
              <p>Online Time</p>
              <a href="/buy?tier=10" className={styles.buyButton}>Buy Now</a>
            </div>
            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.badge}>Popular</div>
              <h3>30 Days</h3>
              <div className={styles.price}>R15</div>
              <p>Monthly access</p>
              <a href="/buy?tier=30" className={styles.buyButton}>Buy Now</a>
            </div>
            <div className={styles.pricingCard}>
              <h3>90 Days</h3>
              <div className={styles.price}>R50</div>
              <p>Quarterly access</p>
              <a href="/buy?tier=90" className={styles.buyButton}>Buy Now</a>
            </div>
            <div className={styles.pricingCard}>
              <h3>365 Days</h3>
              <div className={styles.price}>R150</div>
              <p>Full year access</p>
              <a href="/buy?tier=365" className={styles.buyButton}>Buy Now</a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.howItWorks}>
          {mounted && (
            <div className={styles.dancingGif}>
              <div className="tenor-gif-embed" data-postid="4399851572124504852" data-share-method="host" data-aspect-ratio="1.36283" data-width="100%">
                <a href="https://tenor.com/view/dancing-shadow-dancing-man-dancing-shadow-dancing-to-music-gif-4399851572124504852">Dancing Shadow-dancing GIF</a> from <a href="https://tenor.com/search/dancing-gifs">Dancing GIFs</a>
              </div>
            </div>
          )}
          <div className={styles.howItWorksHeader}>
            <div className={styles.titleWrapper}>
              <h2>4 Easy Moves</h2>
              <p className={styles.moveWisely}>Best MOVE ? .. Stay connected, No Data needed!</p>
            </div>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <img src="/images/down150.png" alt="Download" className={styles.stepIcon} />
              <h3>Download <span className={styles.ziiText}>Zii</span> Chat</h3>
              <p>Get the Android app</p>
            </div>
            <div className={styles.step}>
              <img src="/images/buy150.png" alt="Buy Code" className={styles.stepIcon} />
              <h3>Buy Activation Code</h3>
              <p>Choose your plan</p>
            </div>
            <div className={styles.step}>
              <img src="/images/code150.png" alt="Enter Code" className={styles.stepIcon} />
              <h3>Enter Code in App</h3>
              <p>Activate your subscription</p>
            </div>
            <div className={styles.step}>
              <img src="/images/chat150.png" alt="Chat" className={styles.stepIcon} />
              <h3>Chat Without Data!</h3>
              <p>Stay connected anywhere</p>
            </div>
          </div>
        </section>

        {/* Why Choose Zii */}
        <section className={styles.whyChoose}>
          <h2>Why <span className={styles.ziiText}>Zii</span> Chat is Chisa 🔥</h2>
          <ComparisonCards />
        </section>

        {/* Use Cases */}
        <section className={styles.useCases}>
          <div className={styles.ctaButtons}>
            <a href="/download" className={styles.primaryButton}>
              Download Now
            </a>
            <a href="/buy" className={styles.secondaryButton}>
              Grab Your Code
            </a>
          </div>
          <h2>Where <span className={styles.ziiText}>Zii</span> Chat Happens</h2>
          <UseCaseCards />
          <PacmanAnimation />
        </section>

        {/* FAQ Section */}
        <FAQWithSpiral />

        {/* Testimonials */}
        <section className={styles.testimonials}>
          <h2>Mzansi Reviews</h2>
          <StaggerTestimonials />
        </section>

        {/* CTA Section */}
        <section className={styles.finalCta}>
          <h2><span className={styles.gatvol}>GATVOL</span> <span className={styles.noGlow}>of paying for Data?</span></h2>
          <p>Stay connected. Ziirroo data cost!</p>
          <div className={styles.ctaButtons}>
            <a href="/download" className={styles.primaryButton}>
              Download Free App
            </a>
            <a href="/buy" className={styles.secondaryButton}>
              Get Activation Code
            </a>
          </div>
          <p className={styles.ctaSubtext}>
            ✓ Activate your code  ✓ Offline chat always free  ✓ Cancel anytime
          </p>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2025 <span className={styles.ziiText}>Zii</span> Chat. No Data Needed • Privacy First • Powering our S.A💚</p>
          <div className={styles.footerLinks}>
            <a href="/support">Support</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/admin/login">Admin</a>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button onClick={scrollToTop} className={styles.scrollToTop} aria-label="Scroll to top">
            <span className={styles.scrollIcon}>↑</span>
            <span className={styles.scrollText}>Top</span>
          </button>
        )}
      </main>
    </>
  );
}
