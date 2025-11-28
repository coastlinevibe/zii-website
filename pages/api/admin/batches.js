// Admin API: Get all batches with detailed stats
import { supabase } from '../../../lib/supabase';

const PRICING = {
  10: 5,
  30: 15,
  90: 50,
  365: 150
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all batches
    const { data: batches, error: batchesError } = await supabase
      .from('batches')
      .select('*')
      .order('generated_at', { ascending: false });

    if (batchesError) throw batchesError;

    // For each batch, get code statistics
    const batchesWithStats = await Promise.all(
      (batches || []).map(async (batch) => {
        // Get total codes
        const { count: totalCodes } = await supabase
          .from('activation_codes')
          .select('*', { count: 'exact', head: true })
          .eq('batch_id', batch.batch_id);

        // Get used codes
        const { count: usedCodes } = await supabase
          .from('activation_codes')
          .select('*', { count: 'exact', head: true })
          .eq('batch_id', batch.batch_id)
          .eq('status', 'used');

        // Get revoked codes
        const { count: revokedCodes } = await supabase
          .from('activation_codes')
          .select('*', { count: 'exact', head: true })
          .eq('batch_id', batch.batch_id)
          .eq('status', 'revoked');

        const price = PRICING[batch.duration_days] || 0;
        const totalRevenue = (totalCodes || 0) * price;
        const earnedRevenue = (usedCodes || 0) * price;

        return {
          id: batch.id,
          batchId: batch.batch_id,
          count: totalCodes || 0,
          used: usedCodes || 0,
          revoked: revokedCodes || 0,
          available: (totalCodes || 0) - (usedCodes || 0) - (revokedCodes || 0),
          durationDays: batch.duration_days,
          generated: new Date(batch.generated_at).toLocaleString(),
          revenue: {
            total: totalRevenue,
            earned: earnedRevenue,
            potential: totalRevenue - earnedRevenue
          },
          price: price
        };
      })
    );

    return res.status(200).json({
      success: true,
      batches: batchesWithStats
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      batches: []
    });
  }
}
