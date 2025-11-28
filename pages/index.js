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

        {/* Why Choose Zii */}
        <section className={styles.whyChoose}>
          <h2>Why Choose Zii Chat?</h2>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <h3>❌ Traditional Apps</h3>
              <ul>
                <li>Need constant data</li>
                <li>Expensive monthly costs</li>
                <li>Track your activity</li>
                <li>Sell your data</li>
                <li>Centralized servers</li>
              </ul>
            </div>
            <div className={styles.comparisonCard + ' ' + styles.highlight}>
              <h3>✅ Zii Chat</h3>
              <ul>
                <li>Works offline via Bluetooth</li>
                <li>Affordable one-time codes</li>
                <li>No tracking, ever</li>
                <li>Your data stays yours</li>
                <li>Decentralized network</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className={styles.useCases}>
          <h2>Perfect For</h2>
          <div className={styles.useCaseGrid}>
            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>🎓</div>
              <h3>Students</h3>
              <p>Stay connected on campus without burning through data</p>
            </div>
            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>🏢</div>
              <h3>Offices</h3>
              <p>Team communication without internet dependency</p>
            </div>
            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>🏘️</div>
              <h3>Communities</h3>
              <p>Neighborhood chat and local updates</p>
            </div>
            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>🚌</div>
              <h3>Commuters</h3>
              <p>Chat on the go without worrying about data</p>
            </div>
            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>🏕️</div>
              <h3>Events</h3>
              <p>Coordinate at festivals, conferences, gatherings</p>
            </div>
            <div className={styles.useCaseCard}>
              <div className={styles.useCaseIcon}>🔒</div>
              <h3>Privacy Advocates</h3>
              <p>Truly private messaging with no surveillance</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faq}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>💬 How does offline chat work?</h3>
              <p>Zii Chat uses Bluetooth mesh networking to connect nearby devices. Messages hop from phone to phone until they reach the recipient - no internet needed!</p>
            </div>
            <div className={styles.faqItem}>
              <h3>📍 What are location channels?</h3>
              <p>When you're online, you can join chat rooms based on your location - from your street to your city. Connect with people nearby!</p>
            </div>
            <div className={styles.faqItem}>
              <h3>🔐 Is it really private?</h3>
              <p>Yes! All messages are end-to-end encrypted. We don't store messages on servers, track your activity, or sell your data. Ever.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>💰 Why do I need an activation code?</h3>
              <p>Activation codes give you access to online features like location channels and cloud sync. Offline Bluetooth chat is always free!</p>
            </div>
            <div className={styles.faqItem}>
              <h3>📱 Which devices are supported?</h3>
              <p>Currently Android 8.0+. iOS support coming soon! Works on phones and tablets.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>🔋 Does it drain my battery?</h3>
              <p>Nope! Zii Chat is optimized for battery efficiency. Bluetooth Low Energy means minimal power consumption.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>📶 What's the range?</h3>
              <p>Direct Bluetooth range is about 10-30 meters. But with mesh networking, messages can travel much further by hopping between devices!</p>
            </div>
            <div className={styles.faqItem}>
              <h3>💳 What payment methods do you accept?</h3>
              <p>We accept all major payment methods including credit cards, debit cards, and mobile money. Secure checkout guaranteed.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.testimonials}>
          <h2>What People Are Saying</h2>
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p>"Finally! A chat app that doesn't eat my data. Perfect for when I'm out of bundles."</p>
              <div className={styles.author}>- Thabo M., Johannesburg</div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p>"Love the privacy features. No more worrying about who's reading my messages."</p>
              <div className={styles.author}>- Sarah K., Cape Town</div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p>"Our whole campus uses it now. Bluetooth mesh is genius!"</p>
              <div className={styles.author}>- David N., Durban</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.finalCta}>
          <h2>Ready to Break Free from Data Costs?</h2>
          <p>Join thousands of South Africans chatting without limits</p>
          <div className={styles.ctaButtons}>
            <a href="/download" className={styles.primaryButton}>
              Download Free App
            </a>
            <a href="/buy" className={styles.secondaryButton}>
              Get Activation Code
            </a>
          </div>
          <p className={styles.ctaSubtext}>
            ✓ No credit card required to download  ✓ Offline chat always free  ✓ Cancel anytime
          </p>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2025 Zii Chat. Open Source • Privacy First • Decentralized</p>
          <div className={styles.footerLinks}>
            <a href="/support">Support</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/admin/login">Admin</a>
          </div>
        </footer>
      </main>
    </>
  );
}
