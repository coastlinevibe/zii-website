// Activation API endpoint
// This validates activation codes and marks them as used

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
    // TODO: Connect to Vercel KV database
    // For now, return placeholder response
    
    // Check if code exists and is unused
    // const existing = await kv.get(`code:${code}`);
    
    // if (existing && existing.used) {
    //   return res.status(409).json({
    //     success: false,
    //     error: 'Code already activated'
    //   });
    // }
    
    // Mark code as used
    // await kv.set(`code:${code}`, {
    //   entryTimestamp,
    //   validatedAt: Date.now(),
    //   deviceId,
    //   used: true
    // });
    
    // Decode duration from code (placeholder)
    const durationDays = 30; // TODO: Decode from code
    const expiryDate = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
    
    // Generate permanent token
    const token = generateToken(code, deviceId);
    
    return res.status(200).json({
      success: true,
      token,
      expiryDate,
      durationDays
    });
    
  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

function generateToken(code, deviceId) {
  // Simple token generation (TODO: Use proper JWT or similar)
  const data = `${code}:${deviceId}:${Date.now()}`;
  return Buffer.from(data).toString('base64');
}
