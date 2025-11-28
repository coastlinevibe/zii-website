// Admin API: Generate activation codes
const { generateBatch } = require('../../../tools/code-generator');
import { storeBatch } from '../../../lib/supabase';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Add proper authentication
  // For now, simple check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    // Allow for now during development
    // return res.status(401).json({ error: 'Unauthorized' });
  }

  const { count, durationDays, batchId } = req.body;

  // Validate input
  if (!count || !durationDays || !batchId) {
    return res.status(400).json({
      error: 'Missing required fields: count, durationDays, batchId'
    });
  }

  if (count < 1 || count > 10000) {
    return res.status(400).json({
      error: 'Count must be between 1 and 10000'
    });
  }

  const validDurations = [10, 30, 90, 365];
  if (!validDurations.includes(durationDays)) {
    return res.status(400).json({
      error: 'Invalid duration. Must be 10, 30, 90, or 365 days'
    });
  }

  try {
    // Generate codes
    const codes = generateBatch(count, durationDays, batchId);

    // Store codes in Supabase
    const storeResult = await storeBatch(codes, batchId, durationDays);
    
    if (!storeResult.success) {
      return res.status(500).json({
        error: 'Failed to store codes in database',
        message: storeResult.error
      });
    }

    // Create download URLs
    const jsonData = JSON.stringify({
      generated: new Date().toISOString(),
      count: codes.length,
      durationDays,
      batchId,
      codes
    }, null, 2);

    const csvData = generateCSV(codes);

    return res.status(200).json({
      success: true,
      count: codes.length,
      durationDays,
      batchId,
      generated: new Date().toISOString(),
      // Return first 5 codes as preview
      preview: codes.slice(0, 5).map(c => c.code),
      // Data URLs for download
      jsonUrl: `data:application/json;base64,${Buffer.from(jsonData).toString('base64')}`,
      csvUrl: `data:text/csv;base64,${Buffer.from(csvData).toString('base64')}`
    });

  } catch (error) {
    console.error('Code generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate codes',
      message: error.message
    });
  }
}

function generateCSV(codes) {
  const rows = ['Code,Duration (Days),Batch ID,Generated,Used'];
  
  codes.forEach(item => {
    rows.push(`${item.code},${item.durationDays},${item.batchId},${item.generated},${item.used}`);
  });
  
  return rows.join('\n');
}
