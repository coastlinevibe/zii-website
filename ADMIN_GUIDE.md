# Zii Chat Admin Dashboard Guide

## Overview

The Zii Chat Admin Dashboard provides comprehensive tools for managing activation codes, tracking revenue, and monitoring system usage.

## Features

### 1. Code Generation
Generate activation codes in batches with different pricing tiers.

**Pricing Tiers:**
- **R5** - 10 days
- **R15** - 30 days  
- **R50** - 90 days
- **R150** - 365 days

**How to Generate:**
1. Navigate to "Generate Codes" tab
2. Enter number of codes to generate
3. Select pricing tier
4. Enter batch ID (for tracking)
5. Click "Generate"
6. Download JSON or CSV file

### 2. Batch Management
View and manage all generated code batches.

**Features:**
- View all batches with statistics
- See total, used, available, and revoked codes
- Track revenue per batch (earned vs potential)
- View individual codes in each batch
- Revoke codes if needed

**Batch Statistics:**
- Total codes generated
- Codes activated (used)
- Codes available
- Codes revoked
- Revenue earned
- Potential revenue

### 3. Analytics Dashboard
Comprehensive analytics and revenue tracking.

**Metrics Tracked:**
- Total codes generated
- Activation rate (conversion %)
- Available codes
- Revoked codes
- Total revenue value
- Earned revenue (from activated codes)
- Potential revenue (from available codes)

**Revenue by Tier:**
- Breakdown by each pricing tier
- Codes generated per tier
- Activation rate per tier
- Revenue earned per tier

**Recent Activations:**
- Last 20 activations
- Device IDs
- Activation timestamps
- Expiry dates

### 4. Code Revocation
Revoke codes that have been compromised or need to be disabled.

**How to Revoke:**
1. Go to "Batches" tab
2. Click "View Codes" on a batch
3. Find the code to revoke
4. Click "Revoke" button
5. Confirm revocation

**Note:** Revoked codes cannot be reactivated. Users will need a new code.

## API Endpoints

### Generate Codes
```
POST /api/admin/generate
Body: {
  count: 100,
  durationDays: 30,
  batchId: 1
}
```

### Get Batches
```
GET /api/admin/batches
```

### Get Analytics
```
GET /api/admin/analytics
```

### Search Codes
```
GET /api/admin/codes?batchId=1&status=available&limit=50
```

### Revoke Code
```
POST /api/admin/codes
Body: {
  code: "XXXX-XXXX-XXXX-XXXX",
  reason: "Manual revocation"
}
```

### Get Activations
```
GET /api/admin/activations?limit=100
```

## Database Setup

### Supabase Configuration

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the SQL setup script in Supabase SQL Editor:
   - Open `supabase-setup.sql`
   - Copy and paste into Supabase SQL Editor
   - Execute the script

### Tables Created:
- `batches` - Batch metadata
- `activation_codes` - Individual codes
- `activations` - Activation history

### Row Level Security (RLS)
The setup script configures permissive RLS policies. For production:
- Add authentication
- Restrict policies based on user roles
- Add admin-only access controls

## Code Generator Tool

### Command Line Usage

Generate codes locally without database:

```bash
cd tools
node code-generator.js generate 100 30 1
```

**Commands:**
- `generate <count> <days> <batchId>` - Generate codes
- `validate <code>` - Validate a code
- `test` - Run validation tests

**Output:**
- JSON file with code data
- CSV file for distribution/printing

## Security Considerations

### Production Checklist:
- [ ] Change `CODE_SECRET_KEY` in code-generator.js
- [ ] Add proper authentication to admin dashboard
- [ ] Restrict Supabase RLS policies
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS only
- [ ] Add rate limiting to API endpoints
- [ ] Implement admin user management
- [ ] Add audit logging
- [ ] Backup database regularly

### Admin Authentication
Current: Simple localStorage check (development only)

**For Production:**
- Implement proper authentication (NextAuth, Supabase Auth, etc.)
- Use secure session management
- Add role-based access control
- Enable 2FA for admin accounts

## Monitoring & Maintenance

### Daily Tasks:
- Check activation rate
- Monitor revenue
- Review recent activations

### Weekly Tasks:
- Generate new code batches as needed
- Review revoked codes
- Check for suspicious activity

### Monthly Tasks:
- Analyze revenue trends
- Review tier performance
- Plan inventory (code generation)

## Troubleshooting

### Codes Not Generating
- Check Supabase connection
- Verify RLS policies are set
- Check browser console for errors

### Analytics Not Loading
- Verify Supabase tables exist
- Check API endpoint responses
- Review browser network tab

### Revocation Not Working
- Ensure code exists in database
- Check code status (can't revoke already used codes)
- Verify API permissions

## Support

For issues or questions:
1. Check browser console for errors
2. Review Supabase logs
3. Check API response codes
4. Verify database connectivity

## Future Enhancements

Planned features:
- Partner management system
- Bulk code allocation
- Commission tracking
- Advanced analytics charts
- Email notifications
- Automated reporting
- Export functionality
- Code expiry management
