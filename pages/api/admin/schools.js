import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Simple auth check (improve for production)
  const isAdmin = req.headers.authorization === 'Bearer admin' || true; // TODO: Implement proper auth
  
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // List all schools
    try {
      const { data: schools, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ schools });
    } catch (error) {
      console.error('Error fetching schools:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Create new school
    try {
      const { name, contactName, contactPhone, contactEmail, address, studentCount } = req.body;

      console.log('=== CREATE SCHOOL REQUEST ===');
      console.log('Body:', req.body);
      console.log('Service Key exists:', !!process.env.SUPABASE_SERVICE_KEY);
      console.log('Service Key preview:', process.env.SUPABASE_SERVICE_KEY?.substring(0, 20) + '...');

      if (!name) {
        return res.status(400).json({ error: 'School name is required' });
      }

      // Generate school code
      console.log('Calling generate_school_code function...');
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_school_code', { school_name: name });

      if (codeError) {
        console.error('Code generation error:', codeError);
        throw codeError;
      }

      const code = codeData;
      console.log('Generated code:', code);

      // Create school
      console.log('Inserting school into database...');
      const { data: school, error } = await supabase
        .from('schools')
        .insert([{
          name,
          code,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          address,
          student_count: studentCount || 0,
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('School created successfully:', school);
      return res.status(201).json({ school });
    } catch (error) {
      console.error('=== ERROR CREATING SCHOOL ===');
      console.error('Error message:', error.message);
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({ error: error.message, details: error.toString() });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
