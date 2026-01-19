// Export school configuration as JSON for APK embedding
import { createClient } from '@supabase/supabase-js';

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service key exists:', !!process.env.SUPABASE_SERVICE_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    console.log('Export config for school ID:', id);
    
    // Fetch school
    const { data: schools, error: schoolError } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id);

    console.log('School query result:', { schools, error: schoolError });

    if (schoolError || !schools || schools.length === 0) {
      return res.status(404).json({ error: 'School not found', details: schoolError?.message });
    }
    
    const school = schools[0];

    // Fetch grades with encryption keys
    const { data: grades, error: gradesError } = await supabase
      .from('grades')
      .select('*')
      .eq('school_id', id)
      .order('name');

    if (gradesError) {
      return res.status(500).json({ error: 'Error fetching grades' });
    }

    // Fetch students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', id);

    if (studentsError) {
      console.error('Students error:', studentsError);
      return res.status(500).json({ error: 'Error fetching students', details: studentsError.message });
    }

    // Fetch teachers
    const { data: teachers, error: teachersError } = await supabase
      .from('teachers')
      .select('*')
      .eq('school_id', id);

    if (teachersError) {
      console.error('Teachers error:', teachersError);
      return res.status(500).json({ error: 'Error fetching teachers', details: teachersError.message });
    }

    // Fetch parents with their students
    const { data: parents, error: parentsError } = await supabase
      .from('parents')
      .select(`
        *,
        parent_students(student_id)
      `)
      .eq('school_id', id);

    if (parentsError) {
      return res.status(500).json({ error: 'Error fetching parents' });
    }

    // Fetch timetable (use first one or default)
    const { data: timetables, error: timetableError } = await supabase
      .from('timetables')
      .select('*')
      .eq('school_id', id)
      .limit(1);

    const timetable = timetables && timetables.length > 0 ? timetables[0] : {
      school_start: '08:00',
      school_end: '14:00',
      pickup_start: '14:00',
      pickup_end: '15:00',
      breaks: []
    };

    // Build school_config.json structure
    const config = {
      school: {
        id: school.id,
        code: school.code,
        name: school.name,
        contactName: school.contact_name,
        contactPhone: school.contact_phone,
        contactEmail: school.contact_email,
        address: school.address,
        logoUrl: school.logo_url,
        primaryColor: school.primary_color || '#6B46C1'
      },
      grades: (grades || []).map(grade => ({
        id: grade.id,
        name: grade.name,
        encryptionKey: grade.encryption_key
      })),
      teachers: (teachers || []).map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        gradeId: teacher.grade_id || teacher.class_id,
        role: teacher.role
      })),
      students: (students || []).map(student => ({
        id: student.id,
        name: student.name,
        idNumber: student.id_number,
        gradeId: student.grade_id || student.class_id
      })),
      parents: (parents || []).map(parent => ({
        id: parent.id,
        name: parent.name,
        phone: parent.phone,
        email: parent.email,
        studentIds: (parent.parent_students || []).map(ps => ps.student_id)
      })),
      timetable: {
        schoolStart: timetable.school_start,
        schoolEnd: timetable.school_end,
        pickupStart: timetable.pickup_start,
        pickupEnd: timetable.pickup_end,
        breaks: timetable.breaks || []
      }
    };

    // Return as JSON
    res.status(200).json(config);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
