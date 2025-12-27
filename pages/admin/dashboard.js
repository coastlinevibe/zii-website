import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('generate');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  if (!isAuthenticated) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Zii Chat</title>
        <meta name="description" content="Zii Chat Admin Dashboard - Manage activation codes and schools" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.dashboard}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Zii Chat Admin</h1>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>

        {/* Navigation */}
        <nav className={styles.nav}>
          <button
            className={activeTab === 'generate' ? styles.active : ''}
            onClick={() => setActiveTab('generate')}
          >
            🔧 Generate Codes
          </button>
          <button
            className={activeTab === 'batches' ? styles.active : ''}
            onClick={() => setActiveTab('batches')}
          >
            📦 Batches
          </button>
          <button
            className={activeTab === 'analytics' ? styles.active : ''}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button
            className={activeTab === 'fraud' ? styles.active : ''}
            onClick={() => setActiveTab('fraud')}
          >
            🚨 Fraud Detection
          </button>
          <button
            className={activeTab === 'partners' ? styles.active : ''}
            onClick={() => setActiveTab('partners')}
          >
            🤝 Partners
          </button>
          <button
            className={activeTab === 'schools' ? styles.active : ''}
            onClick={() => router.push('/admin/schools')}
          >
            🏫 Schools
          </button>
        </nav>

        {/* Content */}
        <main className={styles.content}>
          {activeTab === 'generate' && <GenerateTab />}
          {activeTab === 'batches' && <BatchesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'fraud' && <FraudDetectionTab />}
          {activeTab === 'partners' && <PartnersTab />}
        </main>
      </div>
    </>
  );
}

// Generate Codes Tab
function GenerateTab() {
  const [count, setCount] = useState(100);
  const [duration, setDuration] = useState('30');
  const [batchId, setBatchId] = useState('1');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const tiers = [
    { days: '10', price: 'R5', label: '10 Days' },
    { days: '30', price: 'R15', label: '30 Days' },
    { days: '90', price: 'R50', label: '90 Days' },
    { days: '365', price: 'R150', label: '365 Days' }
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: parseInt(count),
          durationDays: parseInt(duration),
          batchId: parseInt(batchId)
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.generateTab}>
      <h2>Generate Activation Codes</h2>

      <div className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Number of Codes</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="10000"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Batch ID</label>
            <input
              type="number"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              min="1"
            />
          </div>
        </div>

        <div className={styles.tierSelector}>
          <label>Select Tier</label>
          <div className={styles.tierGrid}>
            {tiers.map((tier) => (
              <div
                key={tier.days}
                className={`${styles.tierCard} ${duration === tier.days ? styles.selected : ''}`}
                onClick={() => setDuration(tier.days)}
              >
                <div className={styles.tierPrice}>{tier.price}</div>
                <div className={styles.tierLabel}>{tier.label}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className={styles.generateButton}
        >
          {generating ? 'Generating...' : `Generate ${count} Codes`}
        </button>
      </div>

      {result && (
        <div className={styles.result}>
          {result.error ? (
            <div className={styles.errorBox}>
              <h3>❌ Error</h3>
              <p>{result.error}</p>
            </div>
          ) : (
            <div className={styles.successBox}>
              <h3>✅ Generated Successfully</h3>
              <div className={styles.resultStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Codes</span>
                  <span className={styles.statValue}>{result.count}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Duration</span>
                  <span className={styles.statValue}>{result.durationDays} days</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Batch ID</span>
                  <span className={styles.statValue}>#{result.batchId}</span>
                </div>
              </div>
              <div className={styles.downloadButtons}>
                <button onClick={() => downloadFile(result.jsonUrl, 'json')}>
                  📄 Download JSON
                </button>
                <button onClick={() => downloadFile(result.csvUrl, 'csv')}>
                  📊 Download CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Batches Tab
function BatchesTab() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch('/api/admin/batches');
      const data = await response.json();
      setBatches(data.batches || []);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewBatchCodes = async (batchId) => {
    setSelectedBatch(batchId);
    setLoadingCodes(true);
    try {
      const response = await fetch(`/api/admin/codes?batchId=${batchId}&limit=100`);
      const data = await response.json();
      setCodes(data.codes || []);
    } catch (error) {
      console.error('Failed to fetch codes:', error);
    } finally {
      setLoadingCodes(false);
    }
  };

  const revokeCode = async (code) => {
    if (!confirm(`Are you sure you want to revoke code ${code}?`)) return;

    try {
      const response = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, reason: 'Admin revocation' })
      });

      const data = await response.json();
      if (data.success) {
        alert('Code revoked successfully');
        // Refresh codes
        if (selectedBatch) {
          viewBatchCodes(selectedBatch);
        }
        fetchBatches();
      } else {
        alert('Failed to revoke code: ' + data.error);
      }
    } catch (error) {
      alert('Error revoking code: ' + error.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading batches...</div>;
  }

  return (
    <div className={styles.batchesTab}>
      <div className={styles.batchesHeader}>
        <h2>Code Batches</h2>
        {selectedBatch && (
          <button onClick={() => setSelectedBatch(null)} className={styles.backButton}>
            ← Back to Batches
          </button>
        )}
      </div>

      {!selectedBatch ? (
        batches.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No batches generated yet</p>
            <p>Generate your first batch in the Generate tab</p>
          </div>
        ) : (
          <div className={styles.batchList}>
            {batches.map((batch) => (
              <div key={batch.id} className={styles.batchCard}>
                <div className={styles.batchHeader}>
                  <h3>Batch #{batch.batchId}</h3>
                  <span className={styles.batchDate}>{batch.generated}</span>
                </div>
                <div className={styles.batchStats}>
                  <div className={styles.batchStat}>
                    <span>Total</span>
                    <strong>{batch.count}</strong>
                  </div>
                  <div className={styles.batchStat}>
                    <span>Used</span>
                    <strong className={styles.used}>{batch.used}</strong>
                  </div>
                  <div className={styles.batchStat}>
                    <span>Available</span>
                    <strong className={styles.available}>{batch.available}</strong>
                  </div>
                  <div className={styles.batchStat}>
                    <span>Revoked</span>
                    <strong className={styles.revoked}>{batch.revoked}</strong>
                  </div>
                  <div className={styles.batchStat}>
                    <span>Duration</span>
                    <strong>{batch.durationDays} days</strong>
                  </div>
                </div>
                <div className={styles.batchRevenue}>
                  <div className={styles.revenueStat}>
                    <span>Price per code:</span>
                    <strong>R{batch.price}</strong>
                  </div>
                  <div className={styles.revenueStat}>
                    <span>Earned:</span>
                    <strong className={styles.earned}>R{batch.revenue.earned}</strong>
                  </div>
                  <div className={styles.revenueStat}>
                    <span>Potential:</span>
                    <strong>R{batch.revenue.potential}</strong>
                  </div>
                </div>
                <button 
                  onClick={() => viewBatchCodes(batch.batchId)}
                  className={styles.viewCodesButton}
                >
                  View Codes
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.codesView}>
          <h3>Batch #{selectedBatch} Codes</h3>
          {loadingCodes ? (
            <div className={styles.loading}>Loading codes...</div>
          ) : (
            <div className={styles.codesTable}>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Used At</th>
                    <th>Device ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code) => (
                    <tr key={code.id}>
                      <td className={styles.codeCell}>{code.code}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[code.status]}`}>
                          {code.status}
                        </span>
                      </td>
                      <td>{new Date(code.created_at).toLocaleDateString()}</td>
                      <td>{code.used_at ? new Date(code.used_at).toLocaleString() : '-'}</td>
                      <td className={styles.deviceId}>{code.device_id || '-'}</td>
                      <td>
                        {code.status === 'available' && (
                          <button
                            onClick={() => revokeCode(code.code)}
                            className={styles.revokeButton}
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Analytics Tab
function AnalyticsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activations, setActivations] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchRecentActivations();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivations = async () => {
    try {
      const response = await fetch('/api/admin/activations?limit=20');
      const data = await response.json();
      setActivations(data.activations || []);
    } catch (error) {
      console.error('Failed to fetch activations:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  return (
    <div className={styles.analyticsTab}>
      <h2>Analytics Dashboard</h2>

      {/* Main Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎫</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats?.totalCodes || 0}</div>
            <div className={styles.statLabel}>Total Codes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats?.usedCodes || 0}</div>
            <div className={styles.statLabel}>Activated</div>
            <div className={styles.statSubtext}>
              {stats?.conversionRate}% conversion
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats?.availableCodes || 0}</div>
            <div className={styles.statLabel}>Available</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🚫</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats?.revokedCodes || 0}</div>
            <div className={styles.statLabel}>Revoked</div>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className={styles.revenueSection}>
        <h3>Revenue Overview</h3>
        <div className={styles.revenueGrid}>
          <div className={styles.revenueCard}>
            <div className={styles.revenueLabel}>Total Value</div>
            <div className={styles.revenueValue}>R{stats?.revenue?.total || 0}</div>
            <div className={styles.revenueSubtext}>All generated codes</div>
          </div>
          <div className={styles.revenueCard}>
            <div className={styles.revenueLabel}>Earned Revenue</div>
            <div className={styles.revenueValue} style={{color: '#00C853'}}>
              R{stats?.revenue?.earned || 0}
            </div>
            <div className={styles.revenueSubtext}>From activated codes</div>
          </div>
          <div className={styles.revenueCard}>
            <div className={styles.revenueLabel}>Potential Revenue</div>
            <div className={styles.revenueValue} style={{color: '#FFA726'}}>
              R{stats?.revenue?.potential || 0}
            </div>
            <div className={styles.revenueSubtext}>Available codes</div>
          </div>
        </div>
      </div>

      {/* Revenue by Tier */}
      <div className={styles.tierSection}>
        <h3>Revenue by Tier</h3>
        <div className={styles.tierGrid}>
          {[
            { days: 10, price: 5, label: '10 Days' },
            { days: 30, price: 15, label: '30 Days' },
            { days: 90, price: 50, label: '90 Days' },
            { days: 365, price: 150, label: '365 Days' }
          ].map(tier => {
            const codes = stats?.codesByTier?.[tier.days] || 0;
            const used = stats?.usedByTier?.[tier.days] || 0;
            const revenue = stats?.revenue?.byTier?.[tier.days] || 0;
            const conversionRate = codes > 0 ? ((used / codes) * 100).toFixed(0) : 0;

            return (
              <div key={tier.days} className={styles.tierCard}>
                <div className={styles.tierHeader}>
                  <span className={styles.tierName}>{tier.label}</span>
                  <span className={styles.tierPrice}>R{tier.price}</span>
                </div>
                <div className={styles.tierStats}>
                  <div className={styles.tierStat}>
                    <span>Generated:</span>
                    <strong>{codes}</strong>
                  </div>
                  <div className={styles.tierStat}>
                    <span>Activated:</span>
                    <strong>{used}</strong>
                  </div>
                  <div className={styles.tierStat}>
                    <span>Conversion:</span>
                    <strong>{conversionRate}%</strong>
                  </div>
                  <div className={styles.tierStat}>
                    <span>Revenue:</span>
                    <strong style={{color: '#00C853'}}>R{revenue}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activations */}
      <div className={styles.activationsSection}>
        <h3>Recent Activations</h3>
        {activations.length === 0 ? (
          <div className={styles.emptyState}>No activations yet</div>
        ) : (
          <div className={styles.activationsTable}>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Duration</th>
                  <th>Device ID</th>
                  <th>Activated At</th>
                  <th>Expires At</th>
                </tr>
              </thead>
              <tbody>
                {activations.slice(0, 10).map((activation, idx) => (
                  <tr key={idx}>
                    <td className={styles.codeCell}>
                      {activation.code || activation.activation_codes?.code}
                    </td>
                    <td>{activation.activation_codes?.duration_days || '-'} days</td>
                    <td className={styles.deviceId}>
                      {activation.device_id?.substring(0, 12)}...
                    </td>
                    <td>{new Date(activation.activated_at).toLocaleString()}</td>
                    <td>{new Date(activation.expiry_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Fraud Detection Tab
function FraudDetectionTab() {
  const [fraudData, setFraudData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFraudData();
  }, []);

  const fetchFraudData = async () => {
    try {
      const response = await fetch('/api/admin/fraud');
      const data = await response.json();
      setFraudData(data);
    } catch (error) {
      console.error('Failed to fetch fraud data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (deviceId) => {
    if (!confirm(`Unban device ${deviceId}?`)) return;

    try {
      const response = await fetch('/api/admin/fraud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unban', deviceId })
      });

      const data = await response.json();
      if (data.success) {
        alert('Device unbanned successfully');
        fetchFraudData();
      } else {
        alert('Failed to unban device: ' + data.error);
      }
    } catch (error) {
      alert('Error unbanning device: ' + error.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading fraud data...</div>;
  }

  return (
    <div className={styles.fraudTab}>
      <h2>Fraud Detection</h2>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🚫</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{fraudData?.statistics?.totalBanned || 0}</div>
            <div className={styles.statLabel}>Banned Devices</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{fraudData?.statistics?.totalAttempts || 0}</div>
            <div className={styles.statLabel}>Failed Attempts</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔴</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>
              {fraudData?.statistics?.attemptsByReason?.already_used || 0}
            </div>
            <div className={styles.statLabel}>Already Used Attempts</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>❌</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>
              {fraudData?.statistics?.attemptsByReason?.not_found || 0}
            </div>
            <div className={styles.statLabel}>Invalid Code Attempts</div>
          </div>
        </div>
      </div>

      {/* Banned Devices */}
      <div className={styles.bannedSection}>
        <h3>Banned Devices</h3>
        {fraudData?.bannedDevices?.length === 0 ? (
          <div className={styles.emptyState}>No banned devices</div>
        ) : (
          <div className={styles.bannedTable}>
            <table>
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Ban Reason</th>
                  <th>Attempts</th>
                  <th>Banned At</th>
                  <th>Banned By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fraudData?.bannedDevices?.map((device) => (
                  <tr key={device.id}>
                    <td className={styles.deviceId}>{device.device_id.substring(0, 16)}...</td>
                    <td>{device.ban_reason}</td>
                    <td>{device.failed_attempts_count}</td>
                    <td>{new Date(device.banned_at).toLocaleString()}</td>
                    <td>{device.banned_by}</td>
                    <td>
                      <button
                        onClick={() => handleUnban(device.device_id)}
                        className={styles.unbanButton}
                      >
                        Unban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Failed Attempts */}
      <div className={styles.attemptsSection}>
        <h3>Recent Failed Attempts (Last 100)</h3>
        {fraudData?.failedAttempts?.length === 0 ? (
          <div className={styles.emptyState}>No failed attempts</div>
        ) : (
          <div className={styles.attemptsTable}>
            <table>
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Code</th>
                  <th>Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {fraudData?.failedAttempts?.slice(0, 20).map((attempt) => (
                  <tr key={attempt.id}>
                    <td className={styles.deviceId}>{attempt.device_id.substring(0, 16)}...</td>
                    <td className={styles.codeCell}>{attempt.code}</td>
                    <td>
                      <span className={`${styles.reasonBadge} ${styles[attempt.failure_reason]}`}>
                        {attempt.failure_reason}
                      </span>
                    </td>
                    <td>{new Date(attempt.attempt_timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Partners Tab
function PartnersTab() {
  return (
    <div className={styles.partnersTab}>
      <h2>Partner Management</h2>

      <div className={styles.comingSoon}>
        <h3>🤝 Coming Soon</h3>
        <p>Partner onboarding and management features</p>
        <ul>
          <li>Partner registration</li>
          <li>Bulk code allocation</li>
          <li>Commission tracking</li>
          <li>Sales reports</li>
        </ul>
      </div>
    </div>
  );
}

// Helper function
function downloadFile(url, type) {
  const link = document.createElement('a');
  link.href = url;
  link.download = `codes.${type}`;
  link.click();
}
