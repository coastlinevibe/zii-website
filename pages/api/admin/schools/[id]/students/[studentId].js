import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id, studentId } = req.query;

  if (req.method === 'DELETE') {
    // Delete student
    try {
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

  if (req.method === 'PUT') {
    // Update student
    try {
      const { name, idNumber, grade, parent1Id, parent1Name, parent1Phone, parent2Id, parent2Name, parent2Phone } = req.body;

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

      // Update student
      const { data: student, error } = await supabase
        .from('students')
        .update({
          name,
          id_number: idNumber,
          grade_id: gradeId
        })
        .eq('id', studentId)
        .eq('school_id', id)
        .select()
        .single();

      if (error) throw error;

      // Update or create parents
      if (parent1Phone) {
        await updateOrCreateParent(id, studentId, parent1Id, parent1Name || 'Parent 1', parent1Phone);
      }
      
      if (parent2Phone) {
        await updateOrCreateParent(id, studentId, parent2Id, parent2Name || 'Parent 2', parent2Phone);
      }

      return res.status(200).json({ student });
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function updateOrCreateParent(schoolId, studentId, parentId, name, phone) {
  try {
    if (parentId) {
      // Update existing parent
      await supabase
        .from('parents')
        .update({ name, phone })
        .eq('id', parentId)
        .eq('school_id', schoolId);
    } else {
      // Create new parent
      const { data: codeData } = await supabase
        .rpc('generate_invite_code', { prefix: 'PAR' });

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

      // Link parent to student
      await supabase
        .from('parent_students')
        .insert([{
          parent_id: parent.id,
          student_id: studentId,
          relationship: 'parent'
        }]);
    }
  } catch (error) {
    console.error('Error updating/creating parent:', error);
  }
}
