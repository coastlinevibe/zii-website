// Admin API: Get analytics with detailed revenue tracking
import { supabase } from '../../../lib/supabase';

// Pricing tiers
const PRICING = {
  10: 5,    // R5 for 10 days
  30: 15,   // R15 for 30 days
  90: 50,   // R50 for 90 days
  365: 150  // R150 for 365 days
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get total codes count
    const { count: totalCodes, error: codesError } = await supabase
      .from('activation_codes')
      .select('*', { count: 'exact', head: true });

    // Get used codes count
    const { count: usedCodes, error: usedError } = await supabase
      .from('activation_codes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'used');

    // Get revoked codes count
    const { count: revokedCodes, error: revokedError } = await supabase
      .from('activation_codes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'revoked');

    // Get total batches
    const { count: totalBatches, error: batchesError } = await supabase
      .from('batches')
      .select('*', { count: 'exact', head: true });

    // Get all codes with duration for revenue calculation
    const { data: allCodes, error: allCodesError } = await supabase
      .from('activation_codes')
      .select('duration_days, status');

    // Calculate revenue
    let totalRevenue = 0;
    let earnedRevenue = 0;
    let potentialRevenue = 0;
    const revenueByTier = { 10: 0, 30: 0, 90: 0, 365: 0 };
    const codesByTier = { 10: 0, 30: 0, 90: 0, 365: 0 };
    const usedByTier = { 10: 0, 30: 0, 90: 0, 365: 0 };

    if (allCodes) {
      allCodes.forEach(code => {
        const days = code.duration_days;
        const price = PRICING[days] || 0;
        
        totalRevenue += price;
        codesByTier[days] = (codesByTier[days] || 0) + 1;
        
        if (code.status === 'used') {
          earnedRevenue += price;
          usedByTier[days] = (usedByTier[days] || 0) + 1;
          revenueByTier[days] = (revenueByTier[days] || 0) + price;
        } else if (code.status === 'available') {
          potentialRevenue += price;
        }
      });
    }

    // Get recent activations
    const { data: recentActivations, error: activationsError } = await supabase
      .from('activations')
      .select('activated_at, device_id, code')
      .order('activated_at', { ascending: false })
      .limit(10);

    // Get activation timeline (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: timelineData, error: timelineError } = await supabase
      .from('activations')
      .select('activated_at')
      .gte('activated_at', thirtyDaysAgo.toISOString())
      .order('activated_at', { ascending: true });

    // Group by day
    const activationsByDay = {};
    if (timelineData) {
      timelineData.forEach(activation => {
        const day = activation.activated_at.split('T')[0];
        activationsByDay[day] = (activationsByDay[day] || 0) + 1;
      });
    }

    return res.status(200).json({
      success: true,
      totalCodes: totalCodes || 0,
      usedCodes: usedCodes || 0,
      availableCodes: (totalCodes || 0) - (usedCodes || 0) - (revokedCodes || 0),
      revokedCodes: revokedCodes || 0,
      totalBatches: totalBatches || 0,
      revenue: {
        total: totalRevenue,
        earned: earnedRevenue,
        potential: potentialRevenue,
        byTier: revenueByTier
      },
      codesByTier,
      usedByTier,
      conversionRate: totalCodes > 0 ? ((usedCodes / totalCodes) * 100).toFixed(1) : 0,
      recentActivations: recentActivations || [],
      activationTimeline: activationsByDay
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      totalCodes: 0,
      usedCodes: 0,
      totalBatches: 0,
      revenue: { total: 0, earned: 0, potential: 0 }
    });
  }
}
