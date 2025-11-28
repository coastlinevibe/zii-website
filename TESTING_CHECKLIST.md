# Zii Chat Admin System - Testing Checklist

## ✅ Pre-Testing Setup

### 1. Database Setup
- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `supabase-reset-and-setup.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify success message: "✅ Setup complete! 3 tables created"

### 2. Environment Check
- [ ] Verify `.env.local` has Supabase credentials
- [ ] Website running on `http://localhost:3000`
- [ ] No console errors in browser

## 🧪 Admin Dashboard Tests

### Test 1: Login
- [ ] Navigate to `http://localhost:3000/admin/login`
- [ ] Enter password: `admin123`
- [ ] Successfully redirected to dashboard

### Test 2: Generate Codes
- [ ] Click "Generate Codes" tab
- [ ] Enter quantity: `10`
- [ ] Select tier: `30 Days (R15)`
- [ ] Enter batch ID: `1`
- [ ] Click "Generate 10 Codes"
- [ ] See success message
- [ ] Download JSON file works
- [ ] Download CSV file works

### Test 3: View Batches
- [ ] Click "Batches" tab
- [ ] See batch #1 listed
- [ ] Stats show: Total=10, Used=0, Available=10, Revoked=0
- [ ] Revenue shows: Earned=R0, Potential=R150
- [ ] Click "View Codes" button
- [ ] See list of 10 codes
- [ ] All codes show status "available"

### Test 4: Code Revocation
- [ ] In batch codes view, find first code
- [ ] Click "Revoke" button
- [ ] Confirm revocation
- [ ] Code status changes to "revoked"
- [ ] Go back to batches
- [ ] Batch stats updated: Revoked=1, Available=9

### Test 5: Analytics
- [ ] Click "Analytics" tab
- [ ] See stats: Total Codes=10, Activated=0, Available=9, Revoked=1
- [ ] Revenue Overview shows: Total=R150, Earned=R0, Potential=R135
- [ ] Revenue by Tier shows 30 Days tier with 10 codes
- [ ] Recent Activations section is empty (no activations yet)

## 📱 Android App Integration Tests

### Test 6: Code Activation (Android)
- [ ] Install APK: `zii-mobile/app/build/outputs/apk/debug/zii-chat-1.8.0-debug.apk`
- [ ] Open app
- [ ] Complete Bluetooth/Location setup
- [ ] See activation screen
- [ ] Enter test code: `ACA8-1E01-9454-CF95`
- [ ] Connect to WiFi
- [ ] Code validates successfully
- [ ] See "Activation Complete" screen
- [ ] Click "Continue to Chat"
- [ ] App works normally

### Test 7: Verify Activation in Admin
- [ ] Go back to admin dashboard
- [ ] Click "Analytics" tab
- [ ] See Activated=1
- [ ] See Recent Activations with device ID
- [ ] Click "Batches" tab
- [ ] Find the batch with activated code
- [ ] Click "View Codes"
- [ ] Find activated code
- [ ] Status shows "used"
- [ ] Device ID is populated
- [ ] Used At timestamp is shown

### Test 8: Try Revoked Code (Android)
- [ ] In admin, revoke a code
- [ ] In Android app, clear activation (if possible) or use new device
- [ ] Try to enter the revoked code
- [ ] Should see error: "Code already used on another device"

## 🔧 Command Line Tools Tests

### Test 9: Code Generator
```bash
cd zii-website/tools
node code-generator.js generate 5 90 2
```
- [ ] Generates 5 codes for 90 days
- [ ] Creates JSON file
- [ ] Creates CSV file
- [ ] Files contain correct data

### Test 10: Code Validation
```bash
node code-generator.js validate ACA8-1E01-9454-CF95
```
- [ ] Shows "✅ Valid code!"
- [ ] Shows duration: 30 days
- [ ] Shows prefix and unique ID

### Test 11: Batch Export
```bash
node export-batch.js batch-30days-1-*.json --format txt
```
- [ ] Creates TXT file
- [ ] Contains all codes
- [ ] Includes instructions

```bash
node export-batch.js batch-30days-1-*.json --format html
```
- [ ] Creates HTML file
- [ ] Open in browser - looks good
- [ ] Can print to PDF

## 🔄 End-to-End Workflow Test

### Test 12: Complete Sales Flow
1. **Generate Codes**
   - [ ] Generate 20 codes for 30 days (batch #3)
   - [ ] Download CSV

2. **Distribute Codes**
   - [ ] Export batch to printable HTML
   - [ ] Verify codes are readable

3. **Customer Activation**
   - [ ] Customer enters code in app
   - [ ] Code validates successfully
   - [ ] Customer can use app

4. **Track in Admin**
   - [ ] See activation in Recent Activations
   - [ ] Revenue updates (Earned increases)
   - [ ] Batch stats update
   - [ ] Conversion rate updates

5. **Handle Issues**
   - [ ] Revoke a compromised code
   - [ ] Verify it can't be used
   - [ ] Generate replacement code

## 📊 Performance Tests

### Test 13: Large Batch Generation
- [ ] Generate 1000 codes
- [ ] Completes in reasonable time (<10 seconds)
- [ ] All codes are unique
- [ ] Database stores correctly

### Test 14: Analytics with Data
- [ ] Generate multiple batches (different tiers)
- [ ] Activate some codes
- [ ] Revoke some codes
- [ ] Analytics shows correct totals
- [ ] Revenue calculations are accurate
- [ ] Conversion rates are correct

## 🔐 Security Tests

### Test 15: Authentication
- [ ] Try accessing `/admin/dashboard` without login
- [ ] Redirects to login page
- [ ] Wrong password shows error
- [ ] Correct password grants access

### Test 16: Code Validation
- [ ] Try invalid code format in app
- [ ] Shows format error
- [ ] Try code with wrong checksum
- [ ] Shows invalid code error

## 🐛 Error Handling Tests

### Test 17: Network Errors
- [ ] Disconnect internet
- [ ] Try to generate codes
- [ ] Shows appropriate error
- [ ] Reconnect internet
- [ ] Retry works

### Test 18: Database Errors
- [ ] Try to revoke non-existent code
- [ ] Shows appropriate error
- [ ] Try to activate already-used code
- [ ] Shows "already used" error

## ✅ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Correct data in database
- ✅ Accurate analytics
- ✅ Smooth user experience
- ✅ Proper error messages

## 📝 Test Results

Date: _______________
Tester: _______________

Total Tests: 18
Passed: _____ / 18
Failed: _____ / 18

Issues Found:
1. ________________________________
2. ________________________________
3. ________________________________

Notes:
_____________________________________
_____________________________________
_____________________________________

---

**Status:** [ ] All Tests Passed  [ ] Issues Found  [ ] Needs Fixes
