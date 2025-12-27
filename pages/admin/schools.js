import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';

export default function SchoolsAdmin() {
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    studentCount: 0
  });

  useEffect(() => {
    // Check auth
    const isAdmin = localStorage.getItem('zii_admin_auth') === 'true' || localStorage.getItem('adminAuth') === 'true';
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/admin/schools');
      const data = await response.json();
      setSchools(data.schools || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchool)
      });

      if (response.ok) {
        const data = await response.json();
        alert(`School created! Code: ${data.school.code}`);
        setShowCreateForm(false);
        setNewSchool({
          name: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          address: '',
          studentCount: 0
        });
        fetchSchools();
      } else {
        alert('Error creating school');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating school');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zii_admin_auth');
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Schools Management - Zii Chat Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.dashboard}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Zii Chat Admin - Schools</h1>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>

        {/* Navigation */}
        <nav className={styles.nav}>
          <button onClick={() => router.push('/admin/dashboard')}>
            🔧 Activation Codes
          </button>
          <button className={styles.active}>
            🏫 Schools
          </button>
        </nav>

        {/* Content */}
        <main className={styles.content}>
          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏫</div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>Total Schools</div>
                <div className={styles.statValue}>{schools.length}</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>Active Schools</div>
                <div className={styles.statValue}>
                  {schools.filter(s => s.status === 'active').length}
                </div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍🎓</div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>Total Students</div>
                <div className={styles.statValue}>
                  {schools.reduce((sum, s) => sum + (s.student_count || 0), 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Schools Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Schools</h2>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className={styles.primaryButton}
              >
                {showCreateForm ? 'Cancel' : '+ Create School'}
              </button>
            </div>

            {showCreateForm && (
              <div className={styles.card}>
                <h3>Create New School</h3>
                <form onSubmit={handleCreateSchool} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>School Name *</label>
                    <input
                      type="text"
                      required
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      placeholder="ABC Primary School"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Contact Name</label>
                      <input
                        type="text"
                        value={newSchool.contactName}
                        onChange={(e) => setNewSchool({...newSchool, contactName: e.target.value})}
                        placeholder="Principal Name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Contact Phone</label>
                      <input
                        type="tel"
                        value={newSchool.contactPhone}
                        onChange={(e) => setNewSchool({...newSchool, contactPhone: e.target.value})}
                        placeholder="0821234567"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={newSchool.contactEmail}
                      onChange={(e) => setNewSchool({...newSchool, contactEmail: e.target.value})}
                      placeholder="principal@school.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Address</label>
                    <textarea
                      value={newSchool.address}
                      onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                      placeholder="123 School Street, City"
                      rows="2"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Estimated Student Count</label>
                    <input
                      type="number"
                      value={newSchool.studentCount}
                      onChange={(e) => setNewSchool({...newSchool, studentCount: parseInt(e.target.value) || 0})}
                      placeholder="200"
                    />
                  </div>

                  <button type="submit" className={styles.primaryButton}>
                    Create School
                  </button>
                </form>
              </div>
            )}

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>School Name</th>
                    <th>Code</th>
                    <th>Contact</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>
                        No schools yet. Create your first school!
                      </td>
                    </tr>
                  ) : (
                    schools.map(school => (
                      <tr key={school.id}>
                        <td><strong>{school.name}</strong></td>
                        <td><code className={styles.code}>{school.code}</code></td>
                        <td>
                          {school.contact_name && (
                            <>
                              {school.contact_name}<br/>
                              <small style={{color: '#666'}}>{school.contact_phone}</small>
                            </>
                          )}
                        </td>
                        <td>{school.student_count || 0}</td>
                        <td>
                          <span className={`${styles.badge} ${styles[school.status]}`}>
                            {school.status}
                          </span>
                        </td>
                        <td>{new Date(school.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => router.push(`/admin/school/${school.id}`)}
                            className={styles.actionButton}
                          >
                            Setup →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
