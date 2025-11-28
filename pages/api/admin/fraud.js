// API endpoint for fraud detection management
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get fraud statistics and banned devices
    try {
      // Get banned devices
      const { data: bannedDevices, error: bannedError } = await supabase
        .from('banned_devices')
        .select('*')
        .order('banned_at', { ascending: false });

      if (bannedError) throw bannedError;

      // Get recent failed attempts
      const { data: failedAttempts, error: attemptsError } = await supabase
        .from('failed_attempts')
        .select('*')
        .order('attempt_timestamp', { ascending: false })
        .limit(100);

      if (attemptsError) throw attemptsError;

      // Get fraud statistics
      const { count: totalBanned } = await supabase
        .from('banned_devices')
        .select('*', { count: 'exact', head: true });

      const { count: totalAttempts } = await supabase
        .from('failed_attempts')
        .select('*', { count: 'exact', head: true });

      // Count attempts by reason
      const attemptsByReason = {};
      failedAttempts?.forEach(attempt => {
        const reason = attempt.failure_reason || 'unknown';
        attemptsByReason[reason] = (attemptsByReason[reason] || 0) + 1;
      });

      return res.status(200).json({
        success: true,
        bannedDevices: bannedDevices || [],
        failedAttempts: failedAttempts || [],
        statistics: {
          totalBanned: totalBanned || 0,
          totalAttempts: totalAttempts || 0,
          attemptsByReason
        }
      });
    } catch (error) {
      console.error('Error fetching fraud data:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  if (req.method === 'POST') {
    // Unban a device
    const { deviceId, action } = req.body;

    if (action === 'unban' && deviceId) {
      try {
        const { error } = await supabase
          .from('banned_devices')
          .delete()
          .eq('device_id', deviceId);

        if (error) throw error;

        return res.status(200).json({
          success: true,
          message: 'Device unbanned successfully'
        });
      } catch (error) {
        console.error('Error unbanning device:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid action or missing deviceId'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
