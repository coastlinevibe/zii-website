import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TODO: Replace with actual authentication
    // For now, simple check (CHANGE IN PRODUCTION!)
    if (username === 'admin' && password === 'zii2024') {
      // Store session
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Zii Chat</title>
      </Head>

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>Zii Chat Admin</h1>
          <p className={styles.subtitle}>Code Management System</p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} className={styles.loginButton}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className={styles.loginFooter}>
            <a href="/">← Back to Home</a>
          </div>
        </div>
      </div>
    </>
  );
}
