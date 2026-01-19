// Health check endpoint
export default async function handler(req, res) {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return res.status(200).json({
    status: 'ok',
    supabase: {
      urlConfigured: hasSupabaseUrl,
      keyConfigured: hasSupabaseKey,
      url: hasSupabaseUrl ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'not set'
    }
  });
}
