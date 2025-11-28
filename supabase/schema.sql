-- Zii Chat Activation System Database Schema

-- Table: activation_codes
-- Stores all generated activation codes
CREATE TABLE IF NOT EXISTS activation_codes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(19) UNIQUE NOT NULL, -- XXXX-YYYY-ZZZZ-CCCC
    duration_days INTEGER NOT NULL,
    batch_id INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    device_id VARCHAR(255),
    entry_timestamp BIGINT,
    validated_at TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: batches
-- Tracks code generation batches
CREATE TABLE IF NOT EXISTS batches (
    id BIGSERIAL PRIMARY KEY,
    batch_id INTEGER UNIQUE NOT NULL,
    duration_days INTEGER NOT NULL,
    total_codes INTEGER NOT NULL,
    used_codes INTEGER DEFAULT 0,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: activations
-- Logs all activation attempts (for analytics)
CREATE TABLE IF NOT EXISTS activations (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(19) NOT NULL,
    device_id VARCHAR(255),
    entry_timestamp BIGINT,
    validation_timestamp BIGINT,
    success BOOLEAN,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_codes_code ON activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_codes_batch ON activation_codes(batch_id);
CREATE INDEX IF NOT EXISTS idx_codes_used ON activation_codes(used);
CREATE INDEX IF NOT EXISTS idx_batches_batch_id ON batches(batch_id);
CREATE INDEX IF NOT EXISTS idx_activations_code ON activations(code);
CREATE INDEX IF NOT EXISTS idx_activations_device ON activations(device_id);

-- Function: Update batch used_codes count
CREATE OR REPLACE FUNCTION update_batch_used_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.used = TRUE AND OLD.used = FALSE THEN
        UPDATE batches 
        SET used_codes = used_codes + 1 
        WHERE batch_id = NEW.batch_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update batch count when code is used
DROP TRIGGER IF EXISTS trigger_update_batch_count ON activation_codes;
CREATE TRIGGER trigger_update_batch_count
    AFTER UPDATE ON activation_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_batch_used_count();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_codes_timestamp ON activation_codes;
CREATE TRIGGER trigger_update_codes_timestamp
    BEFORE UPDATE ON activation_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read for validation, admin for everything
CREATE POLICY "Allow public to validate codes" ON activation_codes
    FOR SELECT USING (true);

CREATE POLICY "Allow public to insert activations" ON activations
    FOR INSERT WITH CHECK (true);

-- Note: For admin operations, you'll need to use service_role key
-- or create proper auth policies

-- Sample data for testing (optional)
-- INSERT INTO batches (batch_id, duration_days, total_codes, generated_by, notes)
-- VALUES (1, 30, 100, 'admin', 'Initial test batch');
