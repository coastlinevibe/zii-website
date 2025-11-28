-- Zii Chat Supabase Database Setup - Simple Version
-- Run each section separately in Supabase SQL Editor

-- ============================================
-- STEP 1: Enable UUID extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: Create batches table
-- ============================================
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id INTEGER NOT NULL UNIQUE,
    duration_days INTEGER NOT NULL,
    total_codes INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: Create activation_codes table
-- ============================================
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint
ALTER TABLE activation_codes 
ADD CONSTRAINT fk_batch 
FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE;

-- Add check constraint
ALTER TABLE activation_codes 
ADD CONSTRAINT chk_status 
CHECK (status IN ('available', 'used', 'revoked'));

-- ============================================
-- STEP 4: Create activations table
-- ============================================
CREATE TABLE IF NOT EXISTS activations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(19) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    permanent_token VARCHAR(255),
    entry_timestamp BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint
ALTER TABLE activations 
ADD CONSTRAINT fk_code 
FOREIGN KEY (code) REFERENCES activation_codes(code) ON DELETE CASCADE;

-- ============================================
-- STEP 5: Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_activation_codes_batch_id ON activation_codes(batch_id);
CREATE INDEX IF NOT EXISTS idx_activation_codes_status ON activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_activation_codes_code ON activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_activations_device_id ON activations(device_id);
CREATE INDEX IF NOT EXISTS idx_activations_code ON activations(code);
CREATE INDEX IF NOT EXISTS idx_activations_activated_at ON activations(activated_at);

-- ============================================
-- STEP 6: Enable Row Level Security
-- ============================================
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: Create RLS Policies (Allow all for now)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on batches" ON batches;
DROP POLICY IF EXISTS "Allow all operations on activation_codes" ON activation_codes;
DROP POLICY IF EXISTS "Allow all operations on activations" ON activations;

-- Create permissive policies
CREATE POLICY "Allow all operations on batches"
ON batches FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on activation_codes"
ON activation_codes FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on activations"
ON activations FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- STEP 8: Create update trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 9: Create trigger
-- ============================================
DROP TRIGGER IF EXISTS update_activation_codes_updated_at ON activation_codes;
CREATE TRIGGER update_activation_codes_updated_at
    BEFORE UPDATE ON activation_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION: Check everything is created
-- ============================================
SELECT 
    'Tables' as type,
    table_name as name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('batches', 'activation_codes', 'activations')

UNION ALL

SELECT 
    'Policies' as type,
    policyname as name
FROM pg_policies 
WHERE tablename IN ('batches', 'activation_codes', 'activations')

ORDER BY type, name;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 
    '✅ Database setup complete!' as message,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('batches', 'activation_codes', 'activations')) as tables_created,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('batches', 'activation_codes', 'activations')) as policies_created;
