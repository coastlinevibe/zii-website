// Activation API endpoint
// This validates activation codes and marks them as used
import { validateCode } from '../../lib/supabase';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, entryTimestamp, deviceId } = req.body;

  // Validate input
  if (!code || !entryTimestamp || !deviceId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // Validate code format (XXXX-YYYY-ZZZZ-CCCC)
  const codeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if (!codeRegex.test(code)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid code format'
    });
  }

  try {
    // Validate code with Supabase
    const result = await validateCode(code, entryTimestamp, deviceId);
    
    if (!result.success) {
      return res.status(409).json({
        success: false,
        error: result.error
      });
    }
    
    return res.status(200).json({
      success: true,
      token: result.token,
      expiryDate: result.expiryDate,
      durationDays: result.durationDays
    });
    
  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
