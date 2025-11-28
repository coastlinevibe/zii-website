# Zii Chat Admin - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Database (2 minutes)
1. Open your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Open the file `supabase-reset-and-setup.sql`
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click "Run" button
7. Wait for "✅ Setup complete! 3 tables created"

### Step 2: Access Admin Dashboard (1 minute)
1. Open browser to: `http://localhost:3000/admin/login`
2. Enter password: `admin123`
3. Click "Login"
4. You're in! 🎉

### Step 3: Generate Your First Codes (2 minutes)
1. Click "Generate Codes" tab
2. Enter quantity: `10`
3. Select tier: "30 Days (R15)"
4. Enter batch ID: `1`
5. Click "Generate 10 Codes"
6. Download the CSV file
7. Done! You have 10 activation codes ready to use

---

## 🎫 Test Your First Code

### In Android App:
1. Install APK: `zii-mobile/app/build/outputs/apk/debug/zii-chat-1.8.0-debug.apk`
2. Open app and complete setup
3. Enter one of these test codes:
   ```
   ACA8-1E01-9454-CF95
   C4A3-1E01-58E5-3B42
   B2D2-1E01-2A26-57BA
   ```
4. Connect to WiFi
5. Code validates automatically
6. Start chatting!

### Verify in Admin:
1. Go to "Analytics" tab
2. See "Activated: 1"
3. Check "Recent Activations"
4. See your device ID and timestamp

---

## 📊 View Your Stats

### Batches Tab
- See all generated code batches
- Track how many codes are used
- Monitor revenue (earned vs potential)
- Click "View Codes" to see individual codes

### Analytics Tab
- Total codes generated
- Activation rate (conversion %)
- Revenue breakdown by tier
- Recent activations with device IDs

---

## 🔧 Generate More Codes

### Using Dashboard:
1. Go to "Generate Codes" tab
2. Choose quantity and tier
3. Click generate
4. Download files

### Using Command Line:
```bash
cd zii-website/tools
node code-generator.js generate 100 30 2
```

### Export for Distribution:
```bash
node export-batch.js batch-30days-2-*.json --format html
```
Open the HTML file in browser and print to PDF!

---

## 🚫 Revoke a Code

1. Go to "Batches" tab
2. Click "View Codes" on a batch
3. Find the code to revoke
4. Click "Revoke" button
5. Confirm
6. Code is now disabled

---

## 💡 Quick Tips

### Pricing Tiers
- **R5** = 10 days (trial)
- **R15** = 30 days (monthly)
- **R50** = 90 days (quarterly)
- **R150** = 365 days (annual)

### Best Practices
- Generate codes in batches of 50-100
- Use different batch IDs for tracking
- Export to HTML for printing
- Monitor conversion rates weekly
- Revoke compromised codes immediately

### Common Tasks
- **Check revenue:** Analytics tab → Revenue Overview
- **Find a code:** Batches tab → View Codes → Search
- **See activations:** Analytics tab → Recent Activations
- **Export codes:** Use export-batch.js tool

---

## 🆘 Need Help?

### Documentation
- Full guide: `ADMIN_GUIDE.md`
- Quick reference: `ADMIN_QUICK_REFERENCE.md`
- Testing: `TESTING_CHECKLIST.md`

### Troubleshooting
- **Can't login?** Check password is `admin123`
- **No codes showing?** Run database setup script
- **Analytics empty?** Generate some codes first
- **Errors in console?** Check Supabase connection

### Tools
```bash
# Verify setup
node scripts/setup-admin.js

# Generate codes
node tools/code-generator.js generate 10 30 1

# Validate code
node tools/code-generator.js validate XXXX-XXXX-XXXX-XXXX

# Export batch
node tools/export-batch.js batch-file.json --format txt
```

---

## ✅ You're Ready!

You now have:
- ✅ Admin dashboard running
- ✅ Database configured
- ✅ Test codes generated
- ✅ Android app integrated
- ✅ Full system working

**Start generating and selling codes!** 🚀

---

**Questions?** Check `ADMIN_GUIDE.md` for detailed documentation.

**Issues?** Review `TESTING_CHECKLIST.md` for troubleshooting.

**Ready to launch?** See `ADMIN_SYSTEM_COMPLETE.md` for deployment guide.
