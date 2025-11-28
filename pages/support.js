import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Support.module.css';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Support - Zii Chat</title>
        <meta name="description" content="Get help with Zii Chat. FAQ, troubleshooting, and contact support." />
      </Head>

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <a href="/" className={styles.logo}>🚀 Zii Chat</a>
            <nav className={styles.nav}>
              <a href="/">Home</a>
              <a href="/download">Download</a>
              <a href="/buy">Buy Code</a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className={styles.hero}>
          <h1>How Can We Help?</h1>
          <p>Find answers, troubleshoot issues, or contact our support team</p>
        </section>

        {/* Quick Help */}
        <section className={styles.quickHelp}>
          <h2>Quick Help</h2>
          <div className={styles.helpGrid}>
            <a href="#faq" className={styles.helpCard}>
              <div className={styles.helpIcon}>❓</div>
              <h3>FAQ</h3>
              <p>Common questions answered</p>
            </a>
            <a href="#troubleshooting" className={styles.helpCard}>
              <div className={styles.helpIcon}>🔧</div>
              <h3>Troubleshooting</h3>
              <p>Fix common issues</p>
            </a>
            <a href="#contact" className={styles.helpCard}>
              <div className={styles.helpIcon}>💬</div>
              <h3>Contact Us</h3>
              <p>Get personalized help</p>
            </a>
            <a href="/download" className={styles.helpCard}>
              <div className={styles.helpIcon}>📱</div>
              <h3>Download</h3>
              <p>Get the latest version</p>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faq} id="faq">
          <h2>Frequently Asked Questions</h2>
          
          <div className={styles.faqCategory}>
            <h3>Getting Started</h3>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary>How do I install Zii Chat?</summary>
                <p>Download the APK from our website, enable "Install from Unknown Sources" in your Android settings, then open the APK file to install.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Do I need an activation code?</summary>
                <p>No! Offline Bluetooth chat is completely free. Activation codes unlock online features like location channels and cloud sync.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>How do I activate my code?</summary>
                <p>Open the app, enter your activation code when prompted, then connect to WiFi within 1 hour to complete activation.</p>
              </details>
            </div>
          </div>

          <div className={styles.faqCategory}>
            <h3>Using Zii Chat</h3>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary>How does offline chat work?</summary>
                <p>Zii Chat uses Bluetooth mesh networking. Your phone connects to nearby phones, and messages hop from device to device until they reach the recipient.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>What are location channels?</summary>
                <p>Location channels are chat rooms based on your geographic location. Join channels for your street, neighborhood, city, or region.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Can I use it without internet?</summary>
                <p>Yes! Bluetooth mesh chat works completely offline. You only need internet for location channels and initial activation.</p>
              </details>
            </div>
          </div>

          <div className={styles.faqCategory}>
            <h3>Privacy & Security</h3>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary>Is my data safe?</summary>
                <p>Yes! All messages are end-to-end encrypted. We don't store messages on servers, track your activity, or sell your data.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Can others see my location?</summary>
                <p>No. Location channels use approximate geohash codes. Your exact location is never shared or stored.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Is it open source?</summary>
                <p>Yes! Our code is publicly available on GitHub. Anyone can audit our security and privacy practices.</p>
              </details>
            </div>
          </div>

          <div className={styles.faqCategory}>
            <h3>Billing & Activation</h3>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary>How much does it cost?</summary>
                <p>Offline chat is free forever! Online features: R5 (10 days), R15 (30 days), R50 (90 days), or R150 (365 days).</p>
              </details>
              <details className={styles.faqItem}>
                <summary>Can I get a refund?</summary>
                <p>Yes, within 7 days of purchase if you haven't activated the code yet. Contact support with your order details.</p>
              </details>
              <details className={styles.faqItem}>
                <summary>My code isn't working</summary>
                <p>Make sure you're connected to WiFi and entered the code correctly (format: XXXX-XXXX-XXXX-XXXX). Contact support if issues persist.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className={styles.troubleshooting} id="troubleshooting">
          <h2>Troubleshooting</h2>
          <div className={styles.troubleGrid}>
            <div className={styles.troubleCard}>
              <h3>🔴 Bluetooth Not Working</h3>
              <ul>
                <li>Enable Bluetooth in Android settings</li>
                <li>Grant Bluetooth permissions to Zii Chat</li>
                <li>Restart the app</li>
                <li>Check if other Bluetooth devices work</li>
              </ul>
            </div>
            <div className={styles.troubleCard}>
              <h3>📍 Location Not Working</h3>
              <ul>
                <li>Enable Location services in settings</li>
                <li>Grant Location permissions to Zii Chat</li>
                <li>Make sure you're connected to internet</li>
                <li>Try switching between WiFi and mobile data</li>
              </ul>
            </div>
            <div className={styles.troubleCard}>
              <h3>💬 Messages Not Sending</h3>
              <ul>
                <li>Check if recipient is nearby (for Bluetooth)</li>
                <li>Verify internet connection (for online)</li>
                <li>Restart the app</li>
                <li>Check if you have active subscription</li>
              </ul>
            </div>
            <div className={styles.troubleCard}>
              <h3>🔋 Battery Draining Fast</h3>
              <ul>
                <li>Disable battery optimization for Zii Chat</li>
                <li>Reduce Bluetooth scan frequency in settings</li>
                <li>Close unused location channels</li>
                <li>Update to latest version</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className={styles.contact} id="contact">
          <h2>Contact Support</h2>
          <p className={styles.contactSubtitle}>
            Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
          </p>
          
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Subject</label>
              <select name="subject" value={formData.subject} onChange={handleChange} required>
                <option value="">Select a topic</option>
                <option value="activation">Activation Issues</option>
                <option value="technical">Technical Problem</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Describe your issue or question..."
              />
            </div>
            
            <button type="submit" className={styles.submitButton}>
              {submitted ? '✓ Message Sent!' : 'Send Message'}
            </button>
          </form>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2025 Zii Chat. Open Source • Privacy First • Decentralized</p>
          <div className={styles.footerLinks}>
            <a href="/">Home</a>
            <a href="/download">Download</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </footer>
      </main>
    </>
  );
}
