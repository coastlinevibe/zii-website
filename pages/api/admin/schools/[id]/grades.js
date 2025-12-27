import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id, gradeId } = req.query;

  if (req.method === 'GET') {
    // List grades for school
    try {
      const { data: grades, error } = await supabase
        .from('grades')
        .select('*')
        .eq('school_id', id)
        .order('name');

      if (error) throw error;

      return res.status(200).json({ grades });
    } catch (error) {
      console.error('Error fetching grades:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Create new grade
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Grade name is required' });
      }

      // Generate encryption key
      const { data: keyData, error: keyError } = await supabase
        .rpc('generate_encryption_key');

      if (keyError) throw keyError;

      const encryptionKey = keyData;

      // Create grade
      const { data: grade, error } = await supabase
        .from('grades')
        .insert([{
          school_id: id,
          name,
          encryption_key: encryptionKey
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ grade });
    } catch (error) {
      console.error('Error creating grade:', error);
      return res.status(500).json({ error: error.message });
    }
  }

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

  return res.status(405).json({ error: 'Method not allowed' });
}
