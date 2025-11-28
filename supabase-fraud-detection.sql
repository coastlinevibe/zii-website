-- Fraud Detection System for Zii Chat
-- Add tables for tracking failed attempts and banned devices

-- ============================================
-- Failed Attempts Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS failed_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) NOT NULL,
    code VARCHAR(19) NOT NULL,
    attempt_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    failure_reason VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_failed_attempts_device_id ON failed_attempts(device_id);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_timestamp ON failed_attempts(attempt_timestamp);

-- ============================================
-- Banned Devices
-- ============================================
CREATE TABLE IF NOT EXISTS banned_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) NOT NULL UNIQUE,
    ban_reason TEXT NOT NULL,
    failed_attempts_count INTEGER DEFAULT 0,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    banned_by VARCHAR(100) DEFAULT 'system',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banned_devices_device_id ON banned_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_banned_devices_banned_at ON banned_devices(banned_at);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE failed_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_devices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================
DROP POLICY IF EXISTS "Allow all operations on failed_attempts" ON failed_attempts;
DROP POLICY IF EXISTS "Allow all operations on banned_devices" ON banned_devices;

CREATE POLICY "Allow all operations on failed_attempts"
ON failed_attempts FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on banned_devices"
ON banned_devices FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Helper Function: Check if device is banned
-- ============================================
CREATE OR REPLACE FUNCTION is_device_banned(p_device_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM banned_devices 
        WHERE device_id = p_device_id
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Helper Function: Record failed attempt
-- ============================================
CREATE OR REPLACE FUNCTION record_failed_attempt(
    p_device_id VARCHAR,
    p_code VARCHAR,
    p_reason VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    attempt_count INTEGER;
BEGIN
    -- Insert failed attempt
    INSERT INTO failed_attempts (device_id, code, failure_reason)
    VALUES (p_device_id, p_code, p_reason);
    
    -- Count recent failed attempts (last 24 hours)
    SELECT COUNT(*) INTO attempt_count
    FROM failed_attempts
    WHERE device_id = p_device_id
    AND attempt_timestamp > NOW() - INTERVAL '24 hours'
    AND failure_reason = 'already_used';
    
    -- Auto-ban if 2 or more "already used" attempts
    IF attempt_count >= 2 THEN
        INSERT INTO banned_devices (device_id, ban_reason, failed_attempts_count)
        VALUES (p_device_id, 'Multiple attempts with already-used codes', attempt_count)
        ON CONFLICT (device_id) DO NOTHING;
    END IF;
    
    RETURN attempt_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Verification
-- ============================================
SELECT 
    'Fraud detection tables created' as status,
    (SELECT COUNT(*) FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name IN ('failed_attempts', 'banned_devices')) as tables_count;
