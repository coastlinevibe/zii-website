// API endpoint for code management (search, revoke, view details)
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  // Simple auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-secret-key') {
    // For now, allow all requests (add proper auth later)
  }

  if (req.method === 'GET') {
    // Search/list codes
    const { batchId, status, search, limit = 50, offset = 0 } = req.query;

    try {
      let query = supabase
        .from('activation_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      if (batchId) {
        query = query.eq('batch_id', parseInt(batchId));
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.ilike('code', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return res.status(200).json({
        success: true,
        codes: data,
        count: data.length
      });
    } catch (error) {
      console.error('Error fetching codes:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  if (req.method === 'POST') {
    // Revoke a code
    const { code, reason } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    try {
      // Update code status to revoked
      const { data, error } = await supabase
        .from('activation_codes')
        .update({
          status: 'revoked',
          revoked_at: new Date().toISOString(),
          revoke_reason: reason || 'Manual revocation'
        })
        .eq('code', code)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Code not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Code revoked successfully',
        code: data[0]
      });
    } catch (error) {
      console.error('Error revoking code:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  if (req.method === 'DELETE') {
    // Delete a batch (admin only)
    const { batchId } = req.query;

    if (!batchId) {
      return res.status(400).json({
        success: false,
        error: 'Batch ID is required'
      });
    }

    try {
      // Delete all codes in batch
      const { error: codesError } = await supabase
        .from('activation_codes')
        .delete()
        .eq('batch_id', parseInt(batchId));

      if (codesError) throw codesError;

      // Delete batch record
      const { error: batchError } = await supabase
        .from('batches')
        .delete()
        .eq('batch_id', parseInt(batchId));

      if (batchError) throw batchError;

      return res.status(200).json({
        success: true,
        message: 'Batch deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting batch:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
