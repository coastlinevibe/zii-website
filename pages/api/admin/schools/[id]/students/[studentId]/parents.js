import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id, studentId } = req.query;

  if (req.method === 'GET') {
    // Get parents for a student
    try {
      const { data: parentLinks, error } = await supabase
        .from('parent_students')
        .select('parent_id, parents(id, name, phone, email)')
        .eq('student_id', studentId);

      if (error) throw error;

      const parents = parentLinks.map(link => link.parents);

      return res.status(200).json({ parents });
    } catch (error) {
      console.error('Error fetching parents:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
