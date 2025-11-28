import Head from 'next/head';
import styles from '../styles/Download.module.css';

export default function Download() {
  return (
    <>
      <Head>
        <title>Download Zii Chat - Android APK</title>
        <meta name="description" content="Download Zii Chat for Android" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Download Zii Chat</h1>
          
          <div className={styles.downloadCard}>
            <div className={styles.icon}>📱</div>
            <h2>Android APK</h2>
            <p className={styles.version}>Version 1.8.0</p>
            <p className={styles.size}>~15 MB</p>
            
            <a href="/zii-chat-1.8.0.apk" className={styles.downloadButton} download>
              Download APK
            </a>
            
            <div className={styles.instructions}>
              <h3>Installation Steps:</h3>
              <ol>
                <li>Download the APK file</li>
                <li>Open the file on your Android device</li>
                <li>Allow installation from unknown sources if prompted</li>
                <li>Install and open Zii Chat</li>
                <li>Enter your activation code</li>
              </ol>
            </div>
            
            <div className={styles.requirements}>
              <h3>Requirements:</h3>
              <ul>
                <li>Android 8.0 or higher</li>
                <li>Bluetooth enabled</li>
                <li>Location permission (for Bluetooth scanning)</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.needCode}>
            <p>Don't have an activation code?</p>
            <a href="/buy" className={styles.buyLink}>Buy Activation Code →</a>
          </div>
          
          <div className={styles.backLink}>
            <a href="/">← Back to Home</a>
          </div>
        </div>
      </main>
    </>
  );
}
