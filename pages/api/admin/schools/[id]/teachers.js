import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id, teacherId } = req.query;

  if (req.method === 'GET') {
    // List teachers
    try {
      const { data: teachers, error } = await supabase
        .from('teachers')
        .select('*, grades(name)')
        .eq('school_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ teachers });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Add teacher
    try {
      const { name, phone, email, grade, role } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
      }

      // Find grade ID if grade name provided
      let gradeId = null;
      if (grade) {
        const { data: gradeData } = await supabase
          .from('grades')
          .select('id')
          .eq('school_id', id)
          .eq('name', grade)
          .single();

        gradeId = gradeData?.id;
      }

      // Generate invite code
      const { data: codeData } = await supabase
        .rpc('generate_invite_code', { prefix: 'TCH' });

      const inviteCode = codeData;

      // Insert teacher
      const { data: teacher, error } = await supabase
        .from('teachers')
        .insert([{
          school_id: id,
          grade_id: gradeId,
          name,
          phone,
          email,
          role: role || 'teacher',
          invite_code: inviteCode,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ teacher });
    } catch (error) {
      console.error('Error adding teacher:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    // Update teacher
    try {
      const { teacherId, name, phone, email, grade, role } = req.body;

      if (!teacherId) {
        return res.status(400).json({ error: 'Teacher ID is required' });
      }

      // Find grade ID if grade name provided
      let gradeId = null;
      if (grade) {
        const { data: gradeData } = await supabase
          .from('grades')
          .select('id')
          .eq('school_id', id)
          .eq('name', grade)
          .single();

        gradeId = gradeData?.id;
      }

      // Update teacher
      const { data: teacher, error } = await supabase
        .from('teachers')
        .update({
          name,
          phone,
          email,
          grade_id: gradeId,
          role
        })
        .eq('id', teacherId)
        .eq('school_id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ teacher });
    } catch (error) {
      console.error('Error updating teacher:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    // Delete teacher
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId)
        .eq('school_id', id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
