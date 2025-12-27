import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../../styles/Admin.module.css';

export default function SchoolSetup() {
  const router = useRouter();
  const { id } = router.query;
  
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Grades & Classes
  const [grades, setGrades] = useState([]);
  const [newGradeName, setNewGradeName] = useState('');
  const [expandedGrade, setExpandedGrade] = useState(null);
  
  // Teachers
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    phone: '',
    email: '',
    grade: '',
    role: 'teacher'
  });
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  // Students
  const [students, setStudents] = useState([]);
  const [nextStudentId, setNextStudentId] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    idNumber: '',
    grade: '',
    parent1Name: '',
    parent1Phone: '',
    parent2Name: '',
    parent2Phone: ''
  });
  const [editingStudent, setEditingStudent] = useState(null);
  
  // CSV Upload
  const [uploadType, setUploadType] = useState('teachers');
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Timetable
  const [timetable, setTimetable] = useState({
    schoolStart: '08:00',
    schoolEnd: '14:00',
    pickupStart: '14:00',
    pickupEnd: '15:00',
    periods: [],
    breaks: []
  });
  
  // Stats
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    parents: 0,
    grades: 0
  });

  useEffect(() => {
    if (!id) return;
    
    // Check auth
    const isAdmin = localStorage.getItem('zii_admin_auth') === 'true';
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    fetchSchoolData();
  }, [id]);

  const generateNextStudentId = (schoolCode, existingStudents) => {
    if (!schoolCode || !existingStudents) return '';
    
    // Find the highest number from existing student IDs for this school
    let maxNumber = 0;
    const prefix = schoolCode;
    
    existingStudents.forEach(student => {
      if (student.id_number && student.id_number.startsWith(prefix)) {
        // Extract the last 5 digits
        const numberPart = student.id_number.slice(prefix.length);
        const num = parseInt(numberPart, 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });
    
    // Increment and format as 5 digits
    const nextNumber = (maxNumber + 1).toString().padStart(5, '0');
    return `${prefix}${nextNumber}`;
  };

  const fetchSchoolData = async () => {
    try {
      // Fetch school details
      const schoolRes = await fetch(`/api/admin/schools/${id}`);
      const schoolData = await schoolRes.json();
      setSchool(schoolData.school);
      
      // Fetch grades
      const gradesRes = await fetch(`/api/admin/schools/${id}/grades`);
      const gradesData = await gradesRes.json();
      setGrades(gradesData.grades || []);
      
      // Fetch teachers
      const teachersRes = await fetch(`/api/admin/schools/${id}/teachers`);
      const teachersData = await teachersRes.json();
      setTeachers(teachersData.teachers || []);
      
      // Fetch students
      const studentsRes = await fetch(`/api/admin/schools/${id}/students`);
      const studentsData = await studentsRes.json();
      setStudents(studentsData.students || []);
      
      // Generate next student ID
      if (schoolData.school) {
        const nextId = generateNextStudentId(schoolData.school.code, studentsData.students || []);
        setNextStudentId(nextId);
        setNewStudent(prev => ({ ...prev, idNumber: nextId }));
      }
      
      // Fetch stats
      const statsRes = await fetch(`/api/admin/schools/${id}/stats`);
      const statsData = await statsRes.json();
      setStats(statsData.stats || {});
      
      // Fetch timetable
      const timetableRes = await fetch(`/api/admin/schools/${id}/timetable`);
      const timetableData = await timetableRes.json();
      if (timetableData.timetable) {
        setTimetable(timetableData.timetable);
      }
      
    } catch (error) {
      console.error('Error fetching school data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrade = async (e) => {
    e.preventDefault();
    if (!newGradeName) return;
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGradeName })
      });
      
      if (response.ok) {
        setNewGradeName('');
        fetchSchoolData();
      } else {
        alert('Error creating grade');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating grade');
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher)
      });
      
      if (response.ok) {
        setNewTeacher({ name: '', phone: '', email: '', grade: '', role: 'teacher' });
        fetchSchoolData();
        alert('Teacher added successfully!');
      } else {
        alert('Error adding teacher');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding teacher');
    }
  };

  const handleDeleteGrade = async (gradeId, gradeName) => {
    if (!confirm(`Delete grade "${gradeName}"? This will also remove all teachers and students assigned to this grade.`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/grades/${gradeId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchSchoolData();
        alert('Grade deleted successfully!');
      } else {
        alert('Error deleting grade');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting grade');
    }
  };

  const handleDeleteTeacher = async (teacherId, teacherName) => {
    if (!confirm(`Delete teacher "${teacherName}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/teachers/${teacherId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchSchoolData();
        alert('Teacher deleted successfully!');
      } else {
        alert('Error deleting teacher');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting teacher');
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher({
      id: teacher.id,
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email || '',
      grade: teacher.grades?.name || '',
      role: teacher.role
    });
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/teachers/${editingTeacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTeacher)
      });
      
      if (response.ok) {
        setEditingTeacher(null);
        fetchSchoolData();
        alert('Teacher updated successfully!');
      } else {
        alert('Error updating teacher');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating teacher');
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!confirm(`Delete student "${studentName}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/students/${studentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchSchoolData();
        alert('Student deleted successfully!');
      } else {
        alert('Error deleting student');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting student');
    }
  };

  const handleEditStudent = async (student) => {
    // Fetch parent information for this student
    try {
      const response = await fetch(`/api/admin/schools/${id}/students/${student.id}/parents`);
      const data = await response.json();
      
      const parents = data.parents || [];
      const parent1 = parents[0] || {};
      const parent2 = parents[1] || {};
      
      setEditingStudent({
        id: student.id,
        name: student.name,
        idNumber: student.id_number,
        grade: student.grades?.name || '',
        parent1Id: parent1.id || null,
        parent1Name: parent1.name || '',
        parent1Phone: parent1.phone || '',
        parent2Id: parent2.id || null,
        parent2Name: parent2.name || '',
        parent2Phone: parent2.phone || ''
      });
    } catch (error) {
      console.error('Error fetching parents:', error);
      setEditingStudent({
        id: student.id,
        name: student.name,
        idNumber: student.id_number,
        grade: student.grades?.name || '',
        parent1Id: null,
        parent1Name: '',
        parent1Phone: '',
        parent2Id: null,
        parent2Name: '',
        parent2Phone: ''
      });
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent)
      });
      
      if (response.ok) {
        setEditingStudent(null);
        fetchSchoolData();
        alert('Student updated successfully!');
      } else {
        alert('Error updating student');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating student');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Generate next student ID for the form
        const nextId = generateNextStudentId(school.code, [...students, data.student]);
        
        setNewStudent({
          name: '',
          idNumber: nextId,
          grade: '',
          parent1Name: '',
          parent1Phone: '',
          parent2Name: '',
          parent2Phone: ''
        });
        fetchSchoolData();
        alert('Student added successfully!');
      } else {
        alert('Error adding student');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding student');
    }
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('type', uploadType);
      
      const response = await fetch(`/api/admin/schools/${id}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Success! Imported ${data.count} ${uploadType}`);
        setCsvFile(null);
        fetchSchoolData();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading CSV');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveTimetable = async () => {
    try {
      const response = await fetch(`/api/admin/schools/${id}/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetable)
      });
      
      if (response.ok) {
        alert('Timetable saved!');
      } else {
        alert('Error saving timetable');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving timetable');
    }
  };

  const handleGenerateAPK = async () => {
    if (!confirm('Generate custom APK for this school? This may take a few minutes.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/schools/${id}/apk`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`APK generation started! Build ID: ${data.buildId}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating APK');
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>School Setup - Zii Chat Admin</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </Head>
        <div className={styles.dashboard}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </>
    );
  }

  if (!school) {
    return (
      <>
        <Head>
          <title>School Not Found - Zii Chat Admin</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </Head>
        <div className={styles.dashboard}>
          <div className={styles.emptyState}>School not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{school.name} - Zii Chat Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.dashboard}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <button 
                onClick={() => router.push('/admin/schools')}
                className={styles.backButton}
              >
                ← Back to Schools
              </button>
              <h1>{school.name}</h1>
              <p className={styles.subtitle}>Code: <code>{school.code}</code></p>
            </div>
            <button onClick={handleGenerateAPK} className={styles.generateButton}>
              🚀 Generate APK
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.grades || grades.length}</div>
                <div className={styles.statLabel}>Grades</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍🏫</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.teachers || 0}</div>
                <div className={styles.statLabel}>Teachers</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍🎓</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.students || 0}</div>
                <div className={styles.statLabel}>Students</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍👩‍👧</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.parents || 0}</div>
                <div className={styles.statLabel}>Parents</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className={styles.nav}>
            <button 
              className={activeTab === 'overview' ? styles.active : ''}
              onClick={() => setActiveTab('overview')}
            >
              📋 Overview
            </button>
            <button 
              className={activeTab === 'grades' ? styles.active : ''}
              onClick={() => setActiveTab('grades')}
            >
              📚 Grades & Classes
            </button>
            <button 
              className={activeTab === 'teachers' ? styles.active : ''}
              onClick={() => setActiveTab('teachers')}
            >
              👨‍🏫 Teachers
            </button>
            <button 
              className={activeTab === 'students' ? styles.active : ''}
              onClick={() => setActiveTab('students')}
            >
              👨‍🎓 Students
            </button>
            <button 
              className={activeTab === 'upload' ? styles.active : ''}
              onClick={() => setActiveTab('upload')}
            >
              📤 Upload Data
            </button>
            <button 
              className={activeTab === 'timetable' ? styles.active : ''}
              onClick={() => setActiveTab('timetable')}
            >
              ⏰ Timetable
            </button>
            <button 
              className={activeTab === 'codes' ? styles.active : ''}
              onClick={() => setActiveTab('codes')}
            >
              🎫 Invite Codes
            </button>
          </nav>

          {/* Tab Content */}
          <div style={{marginTop: '2rem'}}>
            {activeTab === 'overview' && (
              <div className={styles.form}>
                <h2>School Information</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem'}}>
                  <div>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>School Name</label>
                    <p style={{margin: 0, fontSize: '1rem', color: '#1a1a2e'}}>{school.name}</p>
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>School Code</label>
                    <p style={{margin: 0, fontSize: '1rem', color: '#1a1a2e'}}><code style={{background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, color: '#667eea'}}>{school.code}</code></p>
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>Contact Person</label>
                    <p style={{margin: 0, fontSize: '1rem', color: '#1a1a2e'}}>{school.contact_name || '-'}</p>
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>Contact Phone</label>
                    <p style={{margin: 0, fontSize: '1rem', color: '#1a1a2e'}}>{school.contact_phone || '-'}</p>
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>Contact Email</label>
                    <p style={{margin: 0, fontSize: '1rem', color: '#1a1a2e'}}>{school.contact_email || '-'}</p>
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>Status</label>
                    <p style={{margin: 0, fontSize: '1rem'}}>
                      <span className={`${styles.badge} ${styles[school.status]}`}>
                        {school.status}
                      </span>
                    </p>
                  </div>
                  <div style={{gridColumn: '1 / -1'}}>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>Address</label>
                    <p style={{margin: 0, fontSize: '1rem', color: '#1a1a2e'}}>{school.address || '-'}</p>
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem', color: '#666'}}>Created</label>
                    <p style={{margin: 0, fontSize: '1rem', color: '#1a1a2e'}}>{new Date(school.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div>
                <div className={styles.form}>
                  <h2>Create New Grade</h2>
                  <form onSubmit={handleCreateGrade}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup} style={{flex: 1}}>
                        <input
                          type="text"
                          value={newGradeName}
                          onChange={(e) => setNewGradeName(e.target.value)}
                          placeholder="Grade 1, Grade 2, etc."
                          required
                        />
                      </div>
                      <button type="submit" className={styles.generateButton}>
                        Create Grade
                      </button>
                    </div>
                  </form>
                </div>

                <div className={styles.batchList}>
                  {grades.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No grades yet. Create your first grade above.</p>
                    </div>
                  ) : (
                    grades.map(grade => {
                      const gradeTeachers = teachers.filter(t => t.grades?.name === grade.name);
                      const gradeStudents = students.filter(s => s.grades?.name === grade.name);
                      const isExpanded = expandedGrade === grade.id;

                      return (
                        <div key={grade.id} className={styles.batchCard}>
                          <div 
                            className={styles.batchHeader} 
                            style={{cursor: 'pointer'}}
                            onClick={() => setExpandedGrade(isExpanded ? null : grade.id)}
                          >
                            <h3>{grade.name}</h3>
                            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteGrade(grade.id, grade.name);
                                }}
                                style={{
                                  background: '#ff4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.3rem 0.8rem',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '600'
                                }}
                              >
                                🗑️ Delete
                              </button>
                              <span className={styles.batchDate}>
                                {gradeTeachers.length} teachers, {gradeStudents.length} students
                              </span>
                              <span style={{fontSize: '1.5rem'}}>
                                {isExpanded ? '▼' : '▶'}
                              </span>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0'}}>
                              <h4 style={{marginBottom: '0.5rem'}}>Teachers ({gradeTeachers.length})</h4>
                              {gradeTeachers.length === 0 ? (
                                <p style={{color: '#666', fontSize: '0.9rem'}}>No teachers assigned</p>
                              ) : (
                                <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
                                  {gradeTeachers.map(teacher => (
                                    <div key={teacher.id} style={{
                                      padding: '0.5rem',
                                      background: '#f8f9fa',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}>
                                      <div>
                                        <strong>{teacher.name}</strong>
                                        <span style={{color: '#666', marginLeft: '0.5rem'}}>
                                          {teacher.phone}
                                        </span>
                                      </div>
                                      <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                                        <span className={`${styles.statusBadge} ${styles[teacher.status]}`}>
                                          {teacher.role}
                                        </span>
                                        <button
                                          onClick={() => handleEditTeacher(teacher)}
                                          style={{
                                            background: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                          }}
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                                          style={{
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                          }}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <h4 style={{marginBottom: '0.5rem', marginTop: '1rem'}}>Students ({gradeStudents.length})</h4>
                              {gradeStudents.length === 0 ? (
                                <p style={{color: '#666', fontSize: '0.9rem'}}>No students assigned</p>
                              ) : (
                                <div style={{display: 'grid', gap: '0.5rem'}}>
                                  {gradeStudents.map(student => (
                                    <div key={student.id} style={{
                                      padding: '0.5rem',
                                      background: '#f8f9fa',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}>
                                      <div>
                                        <strong>{student.name}</strong>
                                        {student.id_number && (
                                          <span style={{color: '#666', marginLeft: '0.5rem', fontSize: '0.85rem'}}>
                                            ID: {student.id_number}
                                          </span>
                                        )}
                                      </div>
                                      <div style={{display: 'flex', gap: '0.3rem'}}>
                                        <button
                                          onClick={() => handleEditStudent(student)}
                                          style={{
                                            background: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                          }}
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => handleDeleteStudent(student.id, student.name)}
                                          style={{
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                          }}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div>
                <div className={styles.form}>
                  <h2>Add Teacher</h2>
                  <form onSubmit={handleAddTeacher}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Name *</label>
                        <input
                          type="text"
                          value={newTeacher.name}
                          onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone *</label>
                        <input
                          type="tel"
                          value={newTeacher.phone}
                          onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                          placeholder="0821234567"
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={newTeacher.email}
                          onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Grade</label>
                        <select
                          value={newTeacher.grade}
                          onChange={(e) => setNewTeacher({...newTeacher, grade: e.target.value})}
                        >
                          <option value="">Select Grade</option>
                          {grades.map(g => (
                            <option key={g.id} value={g.name}>{g.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Role</label>
                        <select
                          value={newTeacher.role}
                          onChange={(e) => setNewTeacher({...newTeacher, role: e.target.value})}
                        >
                          <option value="teacher">Teacher</option>
                          <option value="assistant">Assistant</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className={styles.generateButton}>
                      Add Teacher
                    </button>
                  </form>
                </div>

                <div className={styles.batchList}>
                  <h2>Teachers ({teachers.length})</h2>
                  {teachers.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No teachers yet. Add your first teacher above.</p>
                    </div>
                  ) : (
                    teachers.map(teacher => (
                      <div key={teacher.id} className={styles.batchCard}>
                        <div className={styles.batchHeader}>
                          <h3>{teacher.name}</h3>
                          <span className={`${styles.statusBadge} ${styles[teacher.status]}`}>
                            {teacher.status}
                          </span>
                        </div>
                        <div className={styles.batchStats}>
                          <div className={styles.batchStat}>
                            <span>Phone</span>
                            <strong>{teacher.phone}</strong>
                          </div>
                          <div className={styles.batchStat}>
                            <span>Email</span>
                            <strong>{teacher.email || '-'}</strong>
                          </div>
                          <div className={styles.batchStat}>
                            <span>Role</span>
                            <strong>{teacher.role}</strong>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <div className={styles.form}>
                  <h2>Add Student</h2>
                  <form onSubmit={handleAddStudent}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Student Name *</label>
                        <input
                          type="text"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Student ID</label>
                        <input
                          type="text"
                          value={newStudent.idNumber}
                          readOnly
                          disabled
                          style={{
                            background: '#f0f0f0',
                            cursor: 'not-allowed',
                            color: '#666',
                            fontWeight: '600'
                          }}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Grade *</label>
                        <select
                          value={newStudent.grade}
                          onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                          required
                        >
                          <option value="">Select Grade</option>
                          {grades.map(g => (
                            <option key={g.id} value={g.name}>{g.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <h3 style={{marginTop: '1.5rem'}}>Parent 1 (Optional)</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Parent 1 Name</label>
                        <input
                          type="text"
                          value={newStudent.parent1Name}
                          onChange={(e) => setNewStudent({...newStudent, parent1Name: e.target.value})}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Parent 1 Phone</label>
                        <input
                          type="tel"
                          value={newStudent.parent1Phone}
                          onChange={(e) => setNewStudent({...newStudent, parent1Phone: e.target.value})}
                          placeholder="0821111111"
                        />
                      </div>
                    </div>

                    <h3 style={{marginTop: '1.5rem'}}>Parent 2 (Optional)</h3>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Parent 2 Name</label>
                        <input
                          type="text"
                          value={newStudent.parent2Name}
                          onChange={(e) => setNewStudent({...newStudent, parent2Name: e.target.value})}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Parent 2 Phone</label>
                        <input
                          type="tel"
                          value={newStudent.parent2Phone}
                          onChange={(e) => setNewStudent({...newStudent, parent2Phone: e.target.value})}
                          placeholder="0822222222"
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.generateButton} style={{marginTop: '1.5rem'}}>
                      Add Student
                    </button>
                  </form>
                </div>

                <div className={styles.batchList}>
                  <h2>Students ({students.length})</h2>
                  {students.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No students yet. Add your first student above.</p>
                    </div>
                  ) : (
                    students.map(student => (
                      <div key={student.id} className={styles.batchCard}>
                        <div className={styles.batchHeader}>
                          <h3>{student.name}</h3>
                          <span className={styles.batchDate}>
                            {student.grades?.name || 'No grade'}
                          </span>
                        </div>
                        <div className={styles.batchStats}>
                          <div className={styles.batchStat}>
                            <span>Student ID</span>
                            <strong>{student.id_number || '-'}</strong>
                          </div>
                          <div className={styles.batchStat}>
                            <span>Added</span>
                            <strong>{new Date(student.created_at).toLocaleDateString()}</strong>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div>
                <div className={styles.form}>
                  <h2>Bulk Import</h2>
                  <p style={{color: '#666', marginBottom: '1.5rem'}}>
                    Upload CSV files to import teachers, students, and parents.
                  </p>
                  
                  <form onSubmit={handleCSVUpload}>
                    <div className={styles.formGroup}>
                      <label>Data Type</label>
                      <select 
                        value={uploadType} 
                        onChange={(e) => setUploadType(e.target.value)}
                      >
                        <option value="teachers">Teachers</option>
                        <option value="students">Students</option>
                        <option value="parents">Parents</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>CSV File</label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files[0])}
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className={styles.generateButton}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                  </form>
                </div>

                <div className={styles.form}>
                  <h2>CSV Format Examples</h2>
                  
                  <div style={{marginBottom: '1.5rem'}}>
                    <h3 style={{marginBottom: '0.5rem'}}>Teachers CSV</h3>
                    <pre style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px', overflow: 'auto'}}>
{`name,phone,email,grade,role
John Smith,0821234567,john@school.com,Grade 1,teacher
Jane Doe,0827654321,jane@school.com,Grade 1,assistant`}
                    </pre>
                  </div>

                  <div style={{marginBottom: '1.5rem'}}>
                    <h3 style={{marginBottom: '0.5rem'}}>Students CSV</h3>
                    <pre style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px', overflow: 'auto'}}>
{`name,id_number,grade,parent1_phone,parent2_phone
Sarah Jones,0501234567089,Grade 1,0821111111,0822222222
Tom Brown,0509876543210,Grade 1,0823333333,`}
                    </pre>
                  </div>

                  <div>
                    <h3 style={{marginBottom: '0.5rem'}}>Parents CSV</h3>
                    <pre style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px', overflow: 'auto'}}>
{`name,phone,email,student_name
Mary Jones,0821111111,mary@email.com,Sarah Jones
Bob Jones,0822222222,bob@email.com,Sarah Jones`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timetable' && (
              <div className={styles.form}>
                <h2>School Timetable</h2>
                
                <h3 style={{marginTop: '1.5rem'}}>School Hours</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>School Start</label>
                    <input
                      type="time"
                      value={timetable.schoolStart}
                      onChange={(e) => setTimetable({...timetable, schoolStart: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>School End</label>
                    <input
                      type="time"
                      value={timetable.schoolEnd}
                      onChange={(e) => setTimetable({...timetable, schoolEnd: e.target.value})}
                    />
                  </div>
                </div>

                <h3 style={{marginTop: '1.5rem'}}>Pickup Window</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Pickup Start</label>
                    <input
                      type="time"
                      value={timetable.pickupStart}
                      onChange={(e) => setTimetable({...timetable, pickupStart: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Pickup End</label>
                    <input
                      type="time"
                      value={timetable.pickupEnd}
                      onChange={(e) => setTimetable({...timetable, pickupEnd: e.target.value})}
                    />
                  </div>
                </div>

                <button onClick={handleSaveTimetable} className={styles.generateButton} style={{marginTop: '1.5rem'}}>
                  Save Timetable
                </button>

                <div style={{marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px', color: '#856404'}}>
                  <strong>Note:</strong> Periods and breaks configuration coming soon. For now, student communication will be disabled during school hours ({timetable.schoolStart} - {timetable.schoolEnd}) and enabled during pickup time ({timetable.pickupStart} - {timetable.pickupEnd}).
                </div>
              </div>
            )}

            {activeTab === 'codes' && (
              <div className={styles.comingSoon}>
                <h2>Invite Codes</h2>
                <p>Coming soon: Generate and manage invite codes for teachers and parents.</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Teacher Modal */}
        {editingTeacher && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{marginBottom: '1.5rem'}}>Edit Teacher</h2>
              <form onSubmit={handleUpdateTeacher}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input
                      type="text"
                      value={editingTeacher.name}
                      onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={editingTeacher.phone}
                      onChange={(e) => setEditingTeacher({...editingTeacher, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={editingTeacher.email}
                      onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Grade</label>
                    <select
                      value={editingTeacher.grade}
                      onChange={(e) => setEditingTeacher({...editingTeacher, grade: e.target.value})}
                    >
                      <option value="">Select Grade</option>
                      {grades.map(g => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Role</label>
                    <select
                      value={editingTeacher.role}
                      onChange={(e) => setEditingTeacher({...editingTeacher, role: e.target.value})}
                    >
                      <option value="teacher">Teacher</option>
                      <option value="assistant">Assistant</option>
                    </select>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                  <button type="submit" className={styles.generateButton} style={{flex: 1}}>
                    Update Teacher
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingTeacher(null)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {editingStudent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{marginBottom: '1.5rem'}}>Edit Student</h2>
              <form onSubmit={handleUpdateStudent}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Student ID</label>
                    <input
                      type="text"
                      value={editingStudent.idNumber}
                      readOnly
                      disabled
                      style={{
                        background: '#f0f0f0',
                        cursor: 'not-allowed',
                        color: '#666'
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Grade *</label>
                    <select
                      value={editingStudent.grade}
                      onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map(g => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <h3 style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>Parent 1</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Parent 1 Name</label>
                    <input
                      type="text"
                      value={editingStudent.parent1Name}
                      onChange={(e) => setEditingStudent({...editingStudent, parent1Name: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Parent 1 Phone</label>
                    <input
                      type="tel"
                      value={editingStudent.parent1Phone}
                      onChange={(e) => setEditingStudent({...editingStudent, parent1Phone: e.target.value})}
                      placeholder="0821111111"
                    />
                  </div>
                </div>

                <h3 style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>Parent 2</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Parent 2 Name</label>
                    <input
                      type="text"
                      value={editingStudent.parent2Name}
                      onChange={(e) => setEditingStudent({...editingStudent, parent2Name: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Parent 2 Phone</label>
                    <input
                      type="tel"
                      value={editingStudent.parent2Phone}
                      onChange={(e) => setEditingStudent({...editingStudent, parent2Phone: e.target.value})}
                      placeholder="0822222222"
                    />
                  </div>
                </div>

                <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                  <button type="submit" className={styles.generateButton} style={{flex: 1}}>
                    Update Student
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingStudent(null)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
