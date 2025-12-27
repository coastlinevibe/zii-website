import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';
import csv from 'csv-parser';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const type = fields.type[0];
    const file = files.file[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse CSV
    const data = await parseCSV(file.filepath);

    if (data.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty' });
    }

    let count = 0;

    if (type === 'teachers') {
      // Import teachers
      // Expected columns: name, phone, email, grade, role
      for (const row of data) {
        try {
          // Find or create grade
          let gradeId = null;
          if (row.grade) {
            const { data: grade } = await supabase
              .from('grades')
              .select('id')
              .eq('school_id', id)
              .eq('name', row.grade)
              .maybeSingle();

            gradeId = grade?.id;
          }

          // Generate invite code
          const { data: codeData } = await supabase
            .rpc('generate_invite_code', { prefix: 'TEACHER' });

          // Insert teacher
          const { error } = await supabase
            .from('teachers')
            .insert([{
              school_id: id,
              name: row.name,
              phone: row.phone,
              email: row.email,
              role: row.role || 'teacher',
              invite_code: codeData,
              status: 'pending'
            }]);

          if (!error) count++;
        } catch (err) {
          console.error('Error importing teacher:', err);
        }
      }
    } else if (type === 'students') {
      // Import students
      // Expected columns: name, id_number, grade, parent1_phone, parent2_phone
      for (const row of data) {
        try {
          // Find grade
          let gradeId = null;
          if (row.grade) {
            const { data: grade } = await supabase
              .from('grades')
              .select('id')
              .eq('school_id', id)
              .eq('name', row.grade)
              .maybeSingle();

            gradeId = grade?.id;
          }

          // Insert student
          const { data: student, error } = await supabase
            .from('students')
            .insert([{
              school_id: id,
              name: row.name,
              id_number: row.id_number
            }])
            .select()
            .single();

          if (error) throw error;

          // Create parents if phone numbers provided
          const parentPhones = [row.parent1_phone, row.parent2_phone].filter(Boolean);
          
          for (const phone of parentPhones) {
            // Check if parent exists
            let { data: parent } = await supabase
              .from('parents')
              .select('id')
              .eq('school_id', id)
              .eq('phone', phone)
              .maybeSingle();

            if (!parent) {
              // Create parent
              const { data: codeData } = await supabase
                .rpc('generate_invite_code', { prefix: 'PARENT' });

              const { data: newParent } = await supabase
                .from('parents')
                .insert([{
                  school_id: id,
                  name: `Parent of ${row.name}`,
                  phone: phone,
                  invite_code: codeData,
                  status: 'pending'
                }])
                .select()
                .single();

              parent = newParent;
            }

            // Link parent to student
            if (parent) {
              await supabase
                .from('parent_students')
                .insert([{
                  parent_id: parent.id,
                  student_id: student.id,
                  relationship: 'parent'
                }]);
            }
          }

          count++;
        } catch (err) {
          console.error('Error importing student:', err);
        }
      }
    } else if (type === 'parents') {
      // Import parents
      // Expected columns: name, phone, email, student_name
      for (const row of data) {
        try {
          // Find student by name
          const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('school_id', id)
            .eq('name', row.student_name)
            .maybeSingle();

          if (!student) {
            console.warn(`Student not found: ${row.student_name}`);
            continue;
          }

          // Check if parent exists
          let { data: parent } = await supabase
            .from('parents')
            .select('id')
            .eq('school_id', id)
            .eq('phone', row.phone)
            .maybeSingle();

          if (!parent) {
            // Create parent
            const { data: codeData } = await supabase
              .rpc('generate_invite_code', { prefix: 'PARENT' });

            const { data: newParent } = await supabase
              .from('parents')
              .insert([{
                school_id: id,
                name: row.name,
                phone: row.phone,
                email: row.email,
                invite_code: codeData,
                status: 'pending'
              }])
              .select()
              .single();

            parent = newParent;
          }

          // Link parent to student
          if (parent) {
            await supabase
              .from('parent_students')
              .insert([{
                parent_id: parent.id,
                student_id: student.id,
                relationship: 'parent'
              }]);
          }

          count++;
        } catch (err) {
          console.error('Error importing parent:', err);
        }
      }
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({ 
      success: true, 
      count,
      message: `Imported ${count} ${type}`
    });

  } catch (error) {
    console.error('Error uploading CSV:', error);
    return res.status(500).json({ error: error.message });
  }
}
