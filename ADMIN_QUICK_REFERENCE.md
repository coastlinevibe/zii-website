# Zii Chat Admin - Quick Reference Card

## 🔐 Access
- **URL:** http://localhost:3000/admin/login
- **Password:** admin123 (change in production!)

## 💰 Pricing Tiers
| Tier | Duration | Price |
|------|----------|-------|
| R5   | 10 days  | R5    |
| R15  | 30 days  | R15   |
| R50  | 90 days  | R50   |
| R150 | 365 days | R150  |

## 🎫 Generate Codes
1. Click "Generate Codes" tab
2. Enter quantity
3. Select tier (10/30/90/365 days)
4. Enter batch ID
5. Click "Generate"
6. Download JSON/CSV

## 📦 Manage Batches
- View all batches with stats
- Click "View Codes" to see individual codes
- Click "Revoke" to disable a code
- Track revenue per batch

## 📊 Key Metrics
- **Total Codes:** All generated codes
- **Activated:** Codes in use
- **Available:** Unused codes
- **Revoked:** Disabled codes
- **Conversion Rate:** % of codes activated
- **Earned Revenue:** From activated codes
- **Potential Revenue:** From available codes

## 🔧 Command Line Tools

### Generate Codes Locally
```bash
cd tools
node code-generator.js generate 100 30 1
```

### Validate Code
```bash
node code-generator.js validate XXXX-XXXX-XXXX-XXXX
```

### Run Tests
```bash
node code-generator.js test
```

## 🚨 Code Status
- **Available** 🟢 - Ready to use
- **Used** ✅ - Activated on device
- **Revoked** 🔴 - Disabled by admin

## 📱 Test Codes
Sample codes for testing (30 days):
- ACA8-1E01-9454-CF95
- C4A3-1E01-58E5-3B42
- B2D2-1E01-2A26-57BA
- 77AD-1E01-1B2B-FF91
- 3ADE-1E01-8D70-7440

## 🔄 Common Tasks

### Revoke a Code
1. Go to "Batches" tab
2. Click "View Codes" on batch
3. Find code
4. Click "Revoke"
5. Confirm

### Check Revenue
1. Go to "Analytics" tab
2. View "Revenue Overview"
3. Check "Revenue by Tier"

### View Recent Activations
1. Go to "Analytics" tab
2. Scroll to "Recent Activations"
3. See device IDs and timestamps

## 🗄️ Database Tables
- `batches` - Batch metadata
- `activation_codes` - Individual codes
- `activations` - Activation history

## 🔗 API Endpoints
- `POST /api/admin/generate` - Generate codes
- `GET /api/admin/batches` - List batches
- `GET /api/admin/analytics` - Get stats
- `GET /api/admin/codes` - Search codes
- `POST /api/admin/codes` - Revoke code
- `GET /api/admin/activations` - View history
- `POST /api/activate` - Activate code (app)

## ⚠️ Security Checklist
- [ ] Change admin password
- [ ] Update CODE_SECRET_KEY
- [ ] Configure Supabase RLS
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement proper auth
- [ ] Regular backups

## 📞 Support
- Check browser console for errors
- Review Supabase logs
- Verify API responses
- Check database connectivity

## 🎯 Daily Workflow
1. Check analytics dashboard
2. Review activation rate
3. Generate new batches if needed
4. Monitor revenue
5. Check for issues

---

**Last Updated:** November 2025
**Version:** 1.0
