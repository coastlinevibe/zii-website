-- Zii Chat Supabase Database - RESET AND SETUP
-- This will DROP existing tables and recreate them
-- WARNING: This will delete all existing data!

-- ============================================
-- STEP 1: Drop existing tables (if any)
-- ============================================
DROP TABLE IF EXISTS activations CASCADE;
DROP TABLE IF EXISTS activation_codes CASCADE;
DROP TABLE IF EXISTS batches CASCADE;

-- ============================================
-- STEP 2: Enable UUID extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 3: Create batches table
-- ============================================
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id INTEGER NOT NULL UNIQUE,
    duration_days INTEGER NOT NULL,
    total_codes INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: Create activation_codes table
-- ============================================
CREATE TABLE activation_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(19) NOT NULL UNIQUE,
    batch_id INTEGER NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    duration_days INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'used', 'revoked')),
    device_id VARCHAR(255),
    used_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoke_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 5: Create activations table
-- ============================================
CREATE TABLE activations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(19) NOT NULL REFERENCES activation_codes(code) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    permanent_token VARCHAR(255),
    entry_timestamp BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 6: Create indexes
-- ============================================
CREATE INDEX idx_activation_codes_batch_id ON activation_codes(batch_id);
CREATE INDEX idx_activation_codes_status ON activation_codes(status);
CREATE INDEX idx_activation_codes_code ON activation_codes(code);
CREATE INDEX idx_activations_device_id ON activations(device_id);
CREATE INDEX idx_activations_code ON activations(code);
CREATE INDEX idx_activations_activated_at ON activations(activated_at);

-- ============================================
-- STEP 7: Enable Row Level Security
-- ============================================
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 8: Create RLS Policies (Allow all)
-- ============================================
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
-- STEP 9: Create update trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activation_codes_updated_at
    BEFORE UPDATE ON activation_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
    '✅ Setup complete!' as status,
    (SELECT COUNT(*) FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name IN ('batches', 'activation_codes', 'activations')) as tables_created;
