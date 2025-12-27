import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id, gradeId } = req.query;

  if (req.method === 'DELETE') {
    // Delete grade
    try {
      // First, unassign teachers and students from this grade
      await supabase
        .from('teachers')
        .update({ grade_id: null })
        .eq('grade_id', gradeId);

      await supabase
        .from('students')
        .update({ grade_id: null })
        .eq('grade_id', gradeId);

      // Then delete the grade
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', gradeId)
        .eq('school_id', id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting grade:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    // Update grade
    try {
      const { name } = req.body;

      const { data: grade, error } = await supabase
        .from('grades')
        .update({ name })
        .eq('id', gradeId)
        .eq('school_id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ grade });
    } catch (error) {
      console.error('Error updating grade:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
