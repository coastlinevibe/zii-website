-- Zii Chat Supabase Database Setup
-- Run this in your Supabase SQL Editor to set up tables and policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id INTEGER NOT NULL UNIQUE,
    duration_days INTEGER NOT NULL,
    total_codes INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation codes table
CREATE TABLE IF NOT EXISTS activation_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(19) NOT NULL UNIQUE,
    batch_id INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    device_id VARCHAR(255),
    used_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoke_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_batch FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('available', 'used', 'revoked'))
);

-- Activations table (history of all activations)
CREATE TABLE IF NOT EXISTS activations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(19) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    permanent_token VARCHAR(255),
    entry_timestamp BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_code FOREIGN KEY (code) REFERENCES activation_codes(code) ON DELETE CASCADE
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_activation_codes_batch_id ON activation_codes(batch_id);
CREATE INDEX IF NOT EXISTS idx_activation_codes_status ON activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_activation_codes_code ON activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_activations_device_id ON activations(device_id);
CREATE INDEX IF NOT EXISTS idx_activations_code ON activations(code);
CREATE INDEX IF NOT EXISTS idx_activations_activated_at ON activations(activated_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on batches" ON batches;
DROP POLICY IF EXISTS "Allow all operations on activation_codes" ON activation_codes;
DROP POLICY IF EXISTS "Allow all operations on activations" ON activations;

-- Create permissive policies (allow all operations for now)
-- In production, you should restrict these based on authentication

CREATE POLICY "Allow all operations on batches"
ON batches
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on activation_codes"
ON activation_codes
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on activations"
ON activations
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_activation_codes_updated_at ON activation_codes;
CREATE TRIGGER update_activation_codes_updated_at
    BEFORE UPDATE ON activation_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample data
/*
INSERT INTO batches (batch_id, duration_days, total_codes, generated_at)
VALUES (1, 30, 5, NOW())
ON CONFLICT (batch_id) DO NOTHING;

INSERT INTO activation_codes (code, batch_id, duration_days, status)
VALUES 
    ('TEST-1E01-0001-ABCD', 1, 30, 'available'),
    ('TEST-1E01-0002-EFGH', 1, 30, 'available'),
    ('TEST-1E01-0003-IJKL', 1, 30, 'used')
ON CONFLICT (code) DO NOTHING;
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('batches', 'activation_codes', 'activations');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('batches', 'activation_codes', 'activations');

-- Count records
SELECT 
    (SELECT COUNT(*) FROM batches) as batches_count,
    (SELECT COUNT(*) FROM activation_codes) as codes_count,
    (SELECT COUNT(*) FROM activations) as activations_count;
