import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
  } else {
    // Create Supabase client with options to prevent automatic requests
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'x-client-info': 'zii-chat-website'
        }
      }
    });
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export { supabase };

// Helper functions for activation codes

/**
 * Store a batch of codes in database
 */
export async function storeBatch(codes, batchId, durationDays) {
  if (!supabase) {
    return { success: false, error: 'Database not initialized' };
  }
  
  try {
    // Insert batch record
    const { data: batchData, error: batchError } = await supabase
      .from('batches')
      .insert({
        batch_id: batchId,
        duration_days: durationDays,
        total_codes: codes.length,
        generated_by: 'admin'
      })
      .select()
      .single();

    if (batchError) throw batchError;

    // Insert all codes
    const codeRecords = codes.map(item => ({
      code: item.code,
      duration_days: item.durationDays,
      batch_id: item.batchId,
      used: false
    }));

    const { data: codesData, error: codesError } = await supabase
      .from('activation_codes')
      .insert(codeRecords);

    if (codesError) throw codesError;

    return { success: true, batch: batchData };
  } catch (error) {
    console.error('Error storing batch:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all batches
 */
export async function getBatches() {
  if (!supabase) {
    return { success: false, error: 'Database not initialized', batches: [] };
  }
  
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('generated_at', { ascending: false });

    if (error) throw error;
    return { success: true, batches: data };
  } catch (error) {
    console.error('Error fetching batches:', error);
    return { success: false, error: error.message, batches: [] };
  }
}

/**
 * Validate and activate a code
 */
export async function validateCode(code, entryTimestamp, deviceId) {
  if (!supabase) {
    return { success: false, error: 'Database not initialized' };
  }
  
  try {
    // FRAUD CHECK: Check if device is banned
    const { data: bannedDevice } = await supabase
      .from('banned_devices')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (bannedDevice) {
      console.log(`Banned device attempted activation: ${deviceId}`);
      return { 
        success: false, 
        error: 'Device banned due to suspicious activity. Contact support.' 
      };
    }

    // Check if code exists and is unused
    const { data: codeData, error: fetchError } = await supabase
      .from('activation_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (fetchError) {
      // Log failed attempt
      await logActivation(code, deviceId, entryTimestamp, false, 'Code not found');
      await recordFailedAttempt(deviceId, code, 'not_found');
      return { success: false, error: 'Invalid code' };
    }

    if (codeData.status === 'used') {
      // FRAUD DETECTION: Record "already used" attempt
      await logActivation(code, deviceId, entryTimestamp, false, 'Code already used');
      const attemptCount = await recordFailedAttempt(deviceId, code, 'already_used');
      
      // Check if this triggers a ban (2+ attempts)
      if (attemptCount >= 2) {
        console.log(`Device banned for fraud: ${deviceId} (${attemptCount} attempts)`);
        return { 
          success: false, 
          error: 'Device banned due to suspicious activity. Contact support.' 
        };
      }
      
      return { success: false, error: 'Code already activated' };
    }

    if (codeData.status === 'revoked') {
      await logActivation(code, deviceId, entryTimestamp, false, 'Code revoked');
      await recordFailedAttempt(deviceId, code, 'revoked');
      return { success: false, error: 'Code has been revoked' };
    }

    // Mark code as used
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + codeData.duration_days);

    const { error: updateError } = await supabase
      .from('activation_codes')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        device_id: deviceId
      })
      .eq('code', code);

    if (updateError) throw updateError;

    // Create activation record
    await supabase.from('activations').insert({
      code: code,
      device_id: deviceId,
      activated_at: new Date().toISOString(),
      expiry_date: expiryDate.toISOString(),
      permanent_token: generateToken(code, deviceId),
      entry_timestamp: entryTimestamp
    });

    // Log successful activation
    await logActivation(code, deviceId, entryTimestamp, true, null);

    return {
      success: true,
      durationDays: codeData.duration_days,
      expiryDate: expiryDate.getTime(),
      token: generateToken(code, deviceId)
    };

  } catch (error) {
    console.error('Error validating code:', error);
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Log activation attempt
 */
async function logActivation(code, deviceId, entryTimestamp, success, errorMessage) {
  try {
    await supabase.from('activations').insert({
      code,
      device_id: deviceId,
      entry_timestamp: entryTimestamp,
      validation_timestamp: Date.now(),
      success,
      error_message: errorMessage
    });
  } catch (error) {
    console.error('Error logging activation:', error);
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics() {
  if (!supabase) {
    return {
      success: false,
      totalCodes: 0,
      usedCodes: 0,
      totalBatches: 0,
      revenue: 0
    };
  }
  
  try {
    // Get total codes
    const { count: totalCodes } = await supabase
      .from('activation_codes')
      .select('*', { count: 'exact', head: true });

    // Get used codes
    const { count: usedCodes } = await supabase
      .from('activation_codes')
      .select('*', { count: 'exact', head: true })
      .eq('used', true);

    // Get total batches
    const { count: totalBatches } = await supabase
      .from('batches')
      .select('*', { count: 'exact', head: true });

    // Calculate revenue (simplified)
    const { data: usedCodesData } = await supabase
      .from('activation_codes')
      .select('duration_days')
      .eq('used', true);

    let revenue = 0;
    usedCodesData?.forEach(code => {
      if (code.duration_days === 10) revenue += 5;
      else if (code.duration_days === 30) revenue += 15;
      else if (code.duration_days === 90) revenue += 50;
      else if (code.duration_days === 365) revenue += 150;
    });

    return {
      success: true,
      totalCodes: totalCodes || 0,
      usedCodes: usedCodes || 0,
      totalBatches: totalBatches || 0,
      revenue
    };

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      success: false,
      totalCodes: 0,
      usedCodes: 0,
      totalBatches: 0,
      revenue: 0
    };
  }
}

/**
 * Record failed activation attempt (Fraud Detection)
 */
async function recordFailedAttempt(deviceId, code, reason) {
  try {
    // Insert failed attempt
    await supabase.from('failed_attempts').insert({
      device_id: deviceId,
      code: code,
      failure_reason: reason
    });

    // Count recent "already_used" attempts (last 24 hours)
    const { data: attempts } = await supabase
      .from('failed_attempts')
      .select('*')
      .eq('device_id', deviceId)
      .eq('failure_reason', 'already_used')
      .gte('attempt_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const attemptCount = attempts?.length || 0;

    // Auto-ban if 2 or more "already used" attempts
    if (attemptCount >= 2) {
      await supabase.from('banned_devices').insert({
        device_id: deviceId,
        ban_reason: 'Multiple attempts with already-used codes (fraud detection)',
        failed_attempts_count: attemptCount,
        banned_by: 'system'
      });
      
      console.log(`Device auto-banned: ${deviceId} (${attemptCount} fraud attempts)`);
    }

    return attemptCount;
  } catch (error) {
    console.error('Error recording failed attempt:', error);
    return 0;
  }
}

/**
 * Generate activation token
 */
function generateToken(code, deviceId) {
  const data = `${code}:${deviceId}:${Date.now()}`;
  return Buffer.from(data).toString('base64');
}
