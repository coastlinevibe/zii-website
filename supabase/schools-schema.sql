-- Zii Schools Database Schema
-- Add to existing Supabase database

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    address TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#0066CC',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'trial')),
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Grade 1", "Grade 2"
    encryption_key TEXT NOT NULL, -- Base64 encoded key
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "A", "B", "C"
    full_name TEXT NOT NULL, -- e.g., "Grade 1A"
    room_number TEXT,
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grade_id, name)
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'teacher' CHECK (role IN ('teacher', 'assistant')),
    invite_code TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    id_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parents table
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    invite_code TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent-Student relationship table
CREATE TABLE IF NOT EXISTS parent_students (
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    relationship TEXT DEFAULT 'parent', -- parent, guardian, etc.
    PRIMARY KEY (parent_id, student_id)
);

-- Timetables table
CREATE TABLE IF NOT EXISTS timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
    school_start TIME NOT NULL DEFAULT '08:00',
    school_end TIME NOT NULL DEFAULT '14:00',
    pickup_start TIME NOT NULL DEFAULT '14:00',
    pickup_end TIME NOT NULL DEFAULT '15:00',
    periods JSONB, -- Array of {start, end, name}
    breaks JSONB, -- Array of {start, end, name}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, grade_id)
);

-- School APKs table (track generated APKs)
CREATE TABLE IF NOT EXISTS school_apks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    download_url TEXT,
    build_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_schools_code ON schools(code);
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_grades_school ON grades(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_class ON teachers(class_id);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_parents_school ON parents(school_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_student ON parent_students(student_id);
CREATE INDEX IF NOT EXISTS idx_timetables_school ON timetables(school_id);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER timetables_updated_at
    BEFORE UPDATE ON timetables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- RLS Policies (adjust based on your auth setup)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_apks ENABLE ROW LEVEL SECURITY;

-- Allow admin access (adjust based on your auth)
CREATE POLICY "Admin full access to schools" ON schools FOR ALL USING (true);
CREATE POLICY "Admin full access to grades" ON grades FOR ALL USING (true);
CREATE POLICY "Admin full access to classes" ON classes FOR ALL USING (true);
CREATE POLICY "Admin full access to teachers" ON teachers FOR ALL USING (true);
CREATE POLICY "Admin full access to students" ON students FOR ALL USING (true);
CREATE POLICY "Admin full access to parents" ON parents FOR ALL USING (true);
CREATE POLICY "Admin full access to parent_students" ON parent_students FOR ALL USING (true);
CREATE POLICY "Admin full access to timetables" ON timetables FOR ALL USING (true);
CREATE POLICY "Admin full access to school_apks" ON school_apks FOR ALL USING (true);

-- Helper function to generate school code
CREATE OR REPLACE FUNCTION generate_school_code(school_name TEXT)
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Take first 3 letters of school name, uppercase
    code := UPPER(SUBSTRING(REGEXP_REPLACE(school_name, '[^a-zA-Z]', '', 'g'), 1, 3));
    
    -- Add random 3-digit number
    code := code || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    
    -- Check if exists, regenerate if needed
    WHILE EXISTS (SELECT 1 FROM schools WHERE schools.code = code) AND counter < 100 LOOP
        code := UPPER(SUBSTRING(REGEXP_REPLACE(school_name, '[^a-zA-Z]', '', 'g'), 1, 3));
        code := code || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
        counter := counter + 1;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Helper function to generate encryption key
CREATE OR REPLACE FUNCTION generate_encryption_key()
RETURNS TEXT AS $$
BEGIN
    -- Generate 32 random bytes, encode as base64
    RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Helper function to generate invite code
CREATE OR REPLACE FUNCTION generate_invite_code(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Format: PREFIX-XXXX-XXXX
    code := UPPER(prefix) || '-' || 
            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || '-' ||
            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check uniqueness
    WHILE (EXISTS (SELECT 1 FROM teachers WHERE invite_code = code) OR
           EXISTS (SELECT 1 FROM parents WHERE invite_code = code)) AND counter < 100 LOOP
        code := UPPER(prefix) || '-' || 
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || '-' ||
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        counter := counter + 1;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Sample data (optional - for testing)
-- INSERT INTO schools (name, code, contact_name, contact_phone, contact_email, student_count)
-- VALUES ('ABC Primary School', 'ABC123', 'John Smith', '0821234567', 'john@abc.school', 200);
