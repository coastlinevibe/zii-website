import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id, studentId } = req.query;

  if (req.method === 'GET') {
    // List students
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('*, grades(name)')
        .eq('school_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ students });
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Add student
    try {
      const { name, idNumber, grade, parent1Name, parent1Phone, parent2Name, parent2Phone } = req.body;

      if (!name || !grade) {
        return res.status(400).json({ error: 'Name and grade are required' });
      }

      // Find grade ID
      const { data: gradeData, error: gradeError } = await supabase
        .from('grades')
        .select('id')
        .eq('school_id', id)
        .eq('name', grade)
        .single();

      if (gradeError || !gradeData) {
        return res.status(400).json({ error: 'Grade not found' });
      }

      // Insert student with grade_id directly
      const { data: student, error } = await supabase
        .from('students')
        .insert([{
          school_id: id,
          grade_id: gradeData.id,
          name,
          id_number: idNumber
        }])
        .select()
        .single();

      if (error) throw error;

      // Add parents if provided
      const parents = [];
      
      if (parent1Phone) {
        const parent1 = await addParent(id, parent1Name || 'Parent 1', parent1Phone, student.id);
        if (parent1) parents.push(parent1);
      }
      
      if (parent2Phone) {
        const parent2 = await addParent(id, parent2Name || 'Parent 2', parent2Phone, student.id);
        if (parent2) parents.push(parent2);
      }

      return res.status(201).json({ student, parents });
    } catch (error) {
      console.error('Error adding student:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    // Delete student
    try {
      const { studentId } = req.query;
      
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
        .eq('school_id', id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting student:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function addParent(schoolId, name, phone, studentId) {
  try {
    // Check if parent exists
    const { data: existing } = await supabase
      .from('parents')
      .select('id')
      .eq('school_id', schoolId)
      .eq('phone', phone)
      .single();

    let parentId = existing?.id;

    if (!parentId) {
      // Generate invite code
      const { data: codeData } = await supabase
        .rpc('generate_invite_code', { prefix: 'PAR' });

      // Create parent
      const { data: parent, error } = await supabase
        .from('parents')
        .insert([{
          school_id: schoolId,
          name,
          phone,
          invite_code: codeData,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      parentId = parent.id;
    }

    // Link parent to student
    await supabase
      .from('parent_students')
      .insert([{
        parent_id: parentId,
        student_id: studentId,
        relationship: 'parent'
      }]);

    return parentId;
  } catch (error) {
    console.error('Error adding parent:', error);
    return null;
  }
}
