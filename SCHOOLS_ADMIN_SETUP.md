# Zii Schools Admin - Setup Guide

## What Was Added

Added school management to your existing Zii admin dashboard.

### New Files Created:

1. **Database Schema** (`supabase/schools-schema.sql`)
   - Schools, grades, classes tables
   - Teachers, students, parents tables
   - Timetables and APK tracking
   - Helper functions for code generation

2. **Schools List Page** (`pages/admin/schools.js`)
   - View all schools
   - Create new school
   - School statistics
   - Navigate to individual school setup

3. **API Endpoint** (`pages/api/admin/schools.js`)
   - GET /api/admin/schools - List schools
   - POST /api/admin/schools - Create school

### URL Structure:

```
/admin/dashboard → Activation codes (existing)
/admin/schools → School management (NEW)
/admin/school/[id] → Individual school setup (TODO)
```

---

## Setup Instructions

### Step 1: Run Database Migration

```bash
# In Supabase SQL Editor, run:
cat supabase/schools-schema.sql
```

This creates all necessary tables.

### Step 2: Test the Schools Page

1. Login to admin: `http://localhost:3000/admin/login`
2. Navigate to: `http://localhost:3000/admin/schools`
3. Click "Create School"
4. Fill in school details
5. Submit

You should see the new school in the list with a generated code (e.g., "ABC123").

---

## Next Steps (TODO)

### 1. Individual School Setup Page

Create `/pages/admin/school/[id].js`:
- Upload CSVs (teachers, students, parents)
- Create grades/classes
- Set timetable
- Generate invite codes
- Generate custom APK

### 2. CSV Upload API

Create `/pages/api/admin/schools/[id]/upload.js`:
- Parse CSV files
- Bulk insert teachers/students/parents
- Link relationships
- Generate invite codes

### 3. APK Generation

Create `/pages/api/admin/schools/[id]/apk.js`:
- Trigger GitHub Actions workflow
- Pass school config (name, code, logo, colors)
- Build custom APK
- Return download link

### 4. Timetable Setup

Create `/pages/api/admin/schools/[id]/timetable.js`:
- Save school schedule
- Set periods and breaks
- Configure pickup times

---

## Database Schema Overview

### Core Tables:

**schools**
- id, name, code, contact info
- logo_url, primary_color
- status (active/inactive/trial)

**grades**
- id, school_id, name
- encryption_key (for logical mesh isolation)

**classes**
- id, grade_id, name
- full_name (e.g., "Grade 1A")

**teachers**
- id, school_id, class_id
- name, phone, email
- invite_code, status

**students**
- id, school_id, class_id
- name, id_number

**parents**
- id, school_id
- name, phone, email
- invite_code, status

**parent_students** (many-to-many)
- parent_id, student_id
- relationship type

**timetables**
- id, school_id, grade_id
- school_start, school_end
- pickup_start, pickup_end
- periods (JSON), breaks (JSON)

---

## Helper Functions

### generate_school_code(school_name)
Generates unique 6-character code (e.g., "ABC123")

### generate_encryption_key()
Generates 32-byte base64 key for grade isolation

### generate_invite_code(prefix)
Generates invite code (e.g., "TEACHER-1234-5678")

---

## Current Status

✅ **Completed**:
- Database schema
- Schools list page
- Create school functionality
- School code generation

⏳ **In Progress**:
- Individual school setup page
- CSV upload
- APK generation
- Timetable setup

---

## Testing

### Create Test School:

```javascript
// POST /api/admin/schools
{
  "name": "ABC Primary School",
  "contactName": "John Smith",
  "contactPhone": "0821234567",
  "contactEmail": "john@abc.school",
  "address": "123 School St, Johannesburg",
  "studentCount": 200
}
```

### Expected Response:

```javascript
{
  "school": {
    "id": "uuid",
    "name": "ABC Primary School",
    "code": "ABC123",
    "contact_name": "John Smith",
    "status": "active",
    "created_at": "2024-12-25T..."
  }
}
```

---

## Next Build Priority

**Phase 1** (1-2 weeks):
1. Individual school setup page
2. CSV upload (teachers, students, parents)
3. Grade/class creation
4. Invite code generation

**Phase 2** (1 week):
5. Timetable setup UI
6. APK generation trigger

**Phase 3** (1 week):
7. School dashboard (view active users)
8. Analytics per school

---

## Notes

- Schools page integrates with existing admin auth
- Uses same Supabase instance
- Follows existing admin UI patterns
- Ready for production with proper auth

**Status**: Foundation complete, ready for individual school setup page.
