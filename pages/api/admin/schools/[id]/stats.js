import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Count grades
      const { count: gradesCount } = await supabase
        .from('grades')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', id);

      // Count teachers
      const { count: teachersCount } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', id);

      // Count students
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', id);

      // Count parents
      const { count: parentsCount } = await supabase
        .from('parents')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', id);

      const stats = {
        grades: gradesCount || 0,
        teachers: teachersCount || 0,
        students: studentsCount || 0,
        parents: parentsCount || 0
      };

      return res.status(200).json({ stats });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
