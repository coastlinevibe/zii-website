import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    // Create or update APK record (only one per school)
    try {
      // Get school details
      const { data: schools, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id);

      if (schoolError || !schools || schools.length === 0) {
        return res.status(404).json({ error: 'School not found' });
      }

      const school = schools[0];
      const version = '0.4.0-alpha';
      const buildNumber = Date.now();

      // Check if APK record exists
      const { data: existing } = await supabase
        .from('school_apks')
        .select('*')
        .eq('school_id', id)
        .single();

      let apk;
      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('school_apks')
          .update({
            version,
            build_number: buildNumber,
            download_url: null,
            updated_at: new Date().toISOString()
          })
          .eq('school_id', id)
          .select()
          .single();

        if (error) throw error;
        apk = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('school_apks')
          .insert([{
            school_id: id,
            version,
            build_number: buildNumber,
            download_url: null
          }])
          .select()
          .single();

        if (error) throw error;
        apk = data;
      }

      return res.status(200).json({ 
        success: true,
        buildId: apk.id,
        schoolCode: school.code,
        version,
        instructions: `Run this command in PowerShell:\n\ncd zii-school-app-NEW\n.\\build-for-school.ps1 -SchoolId "${id}"`
      });

    } catch (error) {
      console.error('Error creating APK record:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'GET') {
    // Get latest APK for this school
    try {
      const { data: apk, error } = await supabase
        .from('school_apks')
        .select('*')
        .eq('school_id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return res.status(200).json({ apk: apk || null });
    } catch (error) {
      console.error('Error fetching APK:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
