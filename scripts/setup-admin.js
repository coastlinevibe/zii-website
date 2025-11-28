#!/usr/bin/env node

/**
 * Zii Chat Admin Setup Script
 * Helps initialize the admin system and verify configuration
 */

const fs = require('fs');
const path = require('path');

console.log('\n🚀 Zii Chat Admin Setup\n');
console.log('='.repeat(50));

// Check for .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envExists = fs.existsSync(envPath);

console.log('\n📋 Configuration Check:\n');

if (envExists) {
  console.log('✅ .env.local file found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (hasSupabaseUrl) {
    console.log('✅ Supabase URL configured');
  } else {
    console.log('❌ Supabase URL missing');
  }
  
  if (hasSupabaseKey) {
    console.log('✅ Supabase anon key configured');
  } else {
    console.log('❌ Supabase anon key missing');
  }
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('\n⚠️  Missing Supabase configuration!');
    console.log('\nAdd to .env.local:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-project-url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('\n📝 Creating .env.local template...');
  
  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Code Generator Secret (CHANGE THIS!)
CODE_SECRET_KEY=zii-chat-secret-2024-change-me
`;
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
  console.log('\n⚠️  Please update .env.local with your Supabase credentials');
}

// Check for required files
console.log('\n📁 File Check:\n');

const requiredFiles = [
  'pages/admin/dashboard.js',
  'pages/admin/login.js',
  'pages/api/admin/generate.js',
  'pages/api/admin/batches.js',
  'pages/api/admin/analytics.js',
  'pages/api/admin/codes.js',
  'pages/api/admin/activations.js',
  'pages/api/activate.js',
  'lib/supabase.js',
  'tools/code-generator.js',
  'supabase-setup.sql',
  'ADMIN_GUIDE.md'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n✅ All required files present');
} else {
  console.log('\n❌ Some files are missing - please check installation');
}

// Next steps
console.log('\n📚 Next Steps:\n');
console.log('1. Configure Supabase:');
console.log('   - Create project at https://supabase.com');
console.log('   - Update .env.local with your credentials');
console.log('   - Run supabase-setup.sql in SQL Editor');
console.log('');
console.log('2. Start development server:');
console.log('   npm run dev');
console.log('');
console.log('3. Access admin dashboard:');
console.log('   http://localhost:3000/admin/login');
console.log('   Default password: admin123 (CHANGE THIS!)');
console.log('');
console.log('4. Generate test codes:');
console.log('   cd tools');
console.log('   node code-generator.js generate 10 30 1');
console.log('');
console.log('5. Read the admin guide:');
console.log('   Open ADMIN_GUIDE.md for detailed instructions');
console.log('');

// Security warnings
console.log('⚠️  SECURITY WARNINGS:\n');
console.log('- Change CODE_SECRET_KEY in .env.local');
console.log('- Implement proper authentication for production');
console.log('- Update Supabase RLS policies for production');
console.log('- Never commit .env.local to version control');
console.log('- Use strong admin passwords');
console.log('');

console.log('='.repeat(50));
console.log('\n✨ Setup check complete!\n');

// Generate a sample code for testing
console.log('🎫 Generating sample test code...\n');

const crypto = require('crypto');

function generateTestCode() {
  const prefix = crypto.randomBytes(2).toString('hex').toUpperCase();
  const encoded = '1E01'; // 30 days, batch 1
  const uniqueId = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  // Simple checksum
  const SECRET_KEY = 'zii-chat-secret-2024';
  const checksum = crypto
    .createHash('sha256')
    .update(prefix + encoded + uniqueId + SECRET_KEY)
    .digest('hex')
    .substring(0, 4)
    .toUpperCase();
  
  return `${prefix}-${encoded}-${uniqueId}-${checksum}`;
}

const testCode = generateTestCode();
console.log('Sample Test Code (30 days):');
console.log(`   ${testCode}`);
console.log('\nUse this code to test activation in the Android app!');
console.log('');
