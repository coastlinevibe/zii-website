import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get timetable for school
    try {
      const { data: timetable, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('school_id', id)
        .maybeSingle();

      if (error) throw error;

      return res.status(200).json({ timetable });
    } catch (error) {
      console.error('Error fetching timetable:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Create or update timetable
    try {
      const { schoolStart, schoolEnd, pickupStart, pickupEnd, periods, breaks } = req.body;

      // Check if timetable exists
      const { data: existing } = await supabase
        .from('timetables')
        .select('id')
        .eq('school_id', id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data: timetable, error } = await supabase
          .from('timetables')
          .update({
            school_start: schoolStart,
            school_end: schoolEnd,
            pickup_start: pickupStart,
            pickup_end: pickupEnd,
            periods: periods || [],
            breaks: breaks || []
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json({ timetable });
      } else {
        // Create new
        const { data: timetable, error } = await supabase
          .from('timetables')
          .insert([{
            school_id: id,
            school_start: schoolStart,
            school_end: schoolEnd,
            pickup_start: pickupStart,
            pickup_end: pickupEnd,
            periods: periods || [],
            breaks: breaks || []
          }])
          .select()
          .single();

        if (error) throw error;

        return res.status(201).json({ timetable });
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
