import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Download.module.css';

function WhatsIncluded() {
  const [isExpanded, setIsExpanded] = useState(false);

  const features = [
    {
      title: "Offline Bluetooth Chat",
      desc: "Chat with nearby users without internet - always free!"
    },
    {
      title: "Location Channels",
      desc: "Join chat rooms based on your location (requires activation)"
    },
    {
      title: "Private Messaging",
      desc: "End-to-end encrypted one-on-one chats"
    },
    {
      title: "Group Chats",
      desc: "Create and manage group conversations"
    },
    {
      title: "No Tracking",
      desc: "Your privacy is guaranteed - no data collection"
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.faqHeader}>
        <h2>What's Included</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
        >
          {isExpanded ? "Hide Features ▲" : "Show Features ▼"}
        </button>
      </div>
      
      {isExpanded && (
        <div className={styles.featureList}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function DownloadFAQ() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Is it safe to install?",
      a: "Yes! Zii Chat is regularly security audited. The APK is signed and verified."
    },
    {
      q: "Why not on Google Play Store?",
      a: "We're working on it! For now, direct APK download gives you faster updates and no Google tracking."
    },
    {
      q: "Will it work on my phone?",
      a: "If you have Android 8.0 or higher and Bluetooth, yes! Works on most phones from 2018 onwards."
    },
    {
      q: "Do I need an activation code?",
      a: "Not for offline Bluetooth chat! Activation codes unlock online features like location channels."
    }
  ];

  return (
    <section className={styles.faq}>
      <div className={styles.faqHeader}>
        <h2>Download FAQs</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
        >
          {isExpanded ? "Hide FAQs ▲" : "Show FAQs ▼"}
        </button>
      </div>
      
      {isExpanded && (
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={styles.faqButton}
              >
                <h3>{faq.q}</h3>
                <span className={styles.faqToggle}>{openIndex === index ? "–" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className={styles.faqAnswer}>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Download() {
  return (
    <>
      <Head>
        <title>Download Zii Chat - Free Android App</title>
        <meta name="description" content="Download Zii Chat for Android. Chat offline via Bluetooth, connect by location online." />
      </Head>

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <a href="/" className={styles.logo}>🚀 Zii Chat</a>
            <nav className={styles.nav}>
              <a href="/">Home</a>
              <a href="/buy">Buy Code</a>
              <a href="/support">Support</a>
            </nav>
          </div>
        </header>

        {/* Download Hero */}
        <section className={styles.downloadHero}>
          <div className={styles.downloadContent}>
            <h1>Download Zii Chat</h1>
            <p className={styles.subtitle}>
              Free Android app. Chat offline via Bluetooth. No data needed!
            </p>

            <div className={styles.downloadButtons}>
              <a href="/zii-chat-latest.apk" className={styles.downloadButton} download>
                <div className={styles.buttonIcon}>📱</div>
                <div className={styles.buttonText}>
                  <div className={styles.buttonTitle}>Download APK</div>
                  <div className={styles.buttonSubtitle}>Android 8.0+</div>
                </div>
              </a>
              
              <a href="#" className={styles.downloadButton + ' ' + styles.comingSoon}>
                <div className={styles.buttonIcon}>🍎</div>
                <div className={styles.buttonText}>
                  <div className={styles.buttonTitle}>iOS Version</div>
                  <div className={styles.buttonSubtitle}>Coming Soon</div>
                </div>
              </a>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Downloads</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>4.8★</div>
                <div className={styles.statLabel}>Rating</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>5MB</div>
                <div className={styles.statLabel}>Size</div>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Guide */}
        <section className={styles.installGuide}>
          <h2>Installation Guide</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Download the APK</h3>
                <p>Click the download button above to get the latest version</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Enable Unknown Sources</h3>
                <p>Go to Settings → Security → Enable "Install from Unknown Sources"</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Install the App</h3>
                <p>Open the downloaded APK file and follow the prompts</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Grant Permissions</h3>
                <p>Allow Bluetooth and Location permissions for full functionality</p>
              </div>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className={styles.requirements}>
          <h2>System Requirements</h2>
          <div className={styles.reqGrid}>
            <div className={styles.reqCard}>
              <div className={styles.reqIcon}>📱</div>
              <h3>Android Version</h3>
              <p>Android 8.0 (Oreo) or higher</p>
            </div>
            <div className={styles.reqCard}>
              <div className={styles.reqIcon}>💾</div>
              <h3>Storage</h3>
              <p>At least 10MB free space</p>
            </div>
            <div className={styles.reqCard}>
              <div className={styles.reqIcon}>📡</div>
              <h3>Bluetooth</h3>
              <p>Bluetooth 4.0 or higher</p>
            </div>
            <div className={styles.reqCard}>
              <div className={styles.reqIcon}>🔋</div>
              <h3>Battery</h3>
              <p>Optimized for low power usage</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <WhatsIncluded />

        {/* FAQ */}
        <DownloadFAQ />

        {/* CTA */}
        <section className={styles.cta}>
          <h2>Ready to Get Started?</h2>
          <p>Download now and start chatting without data limits</p>
          <a href="/zii-chat-latest.apk" className={styles.ctaButton} download>
            Download Zii Chat
          </a>
          <p className={styles.ctaSubtext}>
            Already have the app? <a href="/buy">Get an activation code</a>
          </p>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2025 Zii Chat. Open Source • Privacy First • Decentralized</p>
          <div className={styles.footerLinks}>
            <a href="/">Home</a>
            <a href="/support">Support</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </footer>
      </main>
    </>
  );
}
