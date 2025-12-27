import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id, teacherId } = req.query;

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

  if (req.method === 'PUT') {
    // Update teacher
    try {
      const { name, phone, email, grade, role } = req.body;

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

  return res.status(405).json({ error: 'Method not allowed' });
}
