// Test Supabase connection
export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return res.status(500).json({ error: 'Missing env vars' });
  }
  
  try {
    // Test the connection
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    return res.status(200).json({
      status: response.status,
      statusText: response.statusText,
      url: url,
      keyLength: key.length,
      working: response.ok
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
