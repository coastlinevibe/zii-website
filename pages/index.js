import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Zii Chat - Data Freedom, Ziirroo Stress!</title>
        <meta name="description" content="Chat offline via Bluetooth. Connect by location online. No data needed!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.problemText}>
              🚫 Out of Data?
            </h1>
            <h2 className={styles.painPoints}>
              No Chat. No Friends. No Life.
            </h2>
            
            <div className={styles.divider}></div>
            
            <h1 className={styles.solutionText}>
              ✅ Stay Connected<br/>
              ✅ Data Freedom<br/>
              ✅ Ziirroo Stress!
            </h1>
            
            <div className={styles.ctaButtons}>
              <a href="/download" className={styles.primaryButton}>
                Download Now
              </a>
              <a href="/buy" className={styles.secondaryButton}>
                Buy Activation Code
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2>How Zii Chat Works</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3>Chat Offline</h3>
              <p>Connect via Bluetooth mesh network. No internet needed!</p>
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
          <h2>Simple Pricing</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>5 Days</h3>
              <div className={styles.price}>R5</div>
              <p>Try it out</p>
              <a href="/buy?tier=5" className={styles.buyButton}>Buy Now</a>
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
          <h2>Get Started in 4 Steps</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Download Zii Chat</h3>
              <p>Get the Android app</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Buy Activation Code</h3>
              <p>Choose your plan</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Enter Code in App</h3>
              <p>Activate your subscription</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Chat Without Data!</h3>
              <p>Stay connected anywhere</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2024 Zii Chat. Open Source • Privacy First • Decentralized</p>
          <div className={styles.footerLinks}>
            <a href="/support">Support</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </footer>
      </main>
    </>
  );
}
