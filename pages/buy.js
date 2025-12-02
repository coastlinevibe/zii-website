import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Buy.module.css';
import Link from 'next/link';

export default function Buy() {
  const [selectedTier, setSelectedTier] = useState('30');
  const [loading, setLoading] = useState(false);
  const [activationCode, setActivationCode] = useState(null);

  const tiers = {
    '10': { days: 10, price: 5, label: '10 Days' },
    '30': { days: 30, price: 15, label: '30 Days' },
    '90': { days: 90, price: 50, label: '90 Days' },
    '365': { days: 365, price: 150, label: '365 Days' }
  };

  const handlePurchase = async () => {
    setLoading(true);
    
    // TODO: Integrate FastPay payment gateway
    // For now, show placeholder
    setTimeout(() => {
      // Simulate code generation
      const code = 'XXXX-YYYY-ZZZZ-CCCC';
      setActivationCode(code);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Buy Activation Code - Zii Chat</title>
        <meta name="description" content="Purchase Zii Chat activation code" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Buy Activation Code</h1>
          
          {!activationCode ? (
            <>
              <div className={styles.tierSelector}>
                {Object.entries(tiers).map(([key, tier]) => (
                  <div
                    key={key}
                    className={`${styles.tierCard} ${selectedTier === key ? styles.selected : ''}`}
                    onClick={() => setSelectedTier(key)}
                  >
                    <h3>{tier.label}</h3>
                    <div className={styles.price}>R{tier.price}</div>
                    <p>{tier.days} days access</p>
                  </div>
                ))}
              </div>

              <div className={styles.paymentSection}>
                <h2>Payment Method</h2>
                <p className={styles.note}>
                  For R15+ purchases, use FastPay online payment.<br/>
                  For R5 or other payment methods, contact us on WhatsApp.
                </p>
                
                {selectedTier === '10' ? (
                  <a 
                    href="https://wa.me/YOUR_NUMBER?text=I want to buy R5 activation code" 
                    className={styles.whatsappButton}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 Contact on WhatsApp
                  </a>
                ) : (
                  <button 
                    className={styles.payButton}
                    onClick={handlePurchase}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay R${tiers[selectedTier].price} with FastPay`}
                  </button>
                )}
              </div>

              <div className={styles.alternativePayment}>
                <h3>Alternative Payment Methods</h3>
                <p>EFT, Cash, or other payment methods available via WhatsApp support</p>
                <a 
                  href="https://wa.me/YOUR_NUMBER?text=I want to buy activation code" 
                  className={styles.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Support →
                </a>
              </div>
            </>
          ) : (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✅</div>
              <h2>Payment Successful!</h2>
              <p>Your activation code:</p>
              <div className={styles.codeDisplay}>{activationCode}</div>
              <div className={styles.instructions}>
                <h3>Next Steps:</h3>
                <ol>
                  <li>Copy your activation code</li>
                  <li>Open Zii Chat app</li>
                  <li>Enter the code when prompted</li>
                  <li>Connect to WiFi within 1 hour to validate</li>
                </ol>
              </div>
              <a href="/download" className={styles.downloadLink}>
                Download Zii Chat →
              </a>
            </div>
          )}
          
          <div className={styles.backLink}>
            <a href="/">← Back to Home</a>
          </div>
        </div>
      </main>
    </>
  );
}
