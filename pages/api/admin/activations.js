// API endpoint for viewing activation history
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { limit = 100, offset = 0, deviceId, code } = req.query;

  try {
    let query = supabase
      .from('activations')
      .select('*')
      .order('activated_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (deviceId) {
      query = query.eq('device_id', deviceId);
    }

    if (code) {
      query = query.eq('code', code);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Fetch code details separately if needed
    const activationsWithDetails = await Promise.all(
      (data || []).map(async (activation) => {
        const { data: codeData } = await supabase
          .from('activation_codes')
          .select('code, duration_days, batch_id')
          .eq('code', activation.code)
          .single();
        
        return {
          ...activation,
          activation_codes: codeData
        };
      })
    );

    return res.status(200).json({
      success: true,
      activations: activationsWithDetails,
      count: activationsWithDetails.length
    });
  } catch (error) {
    console.error('Error fetching activations:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      activations: []
    });
  }
}
