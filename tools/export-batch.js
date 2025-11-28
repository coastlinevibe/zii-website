#!/usr/bin/env node

/**
 * Batch Export Tool
 * Export codes from a batch for distribution to partners
 */

const fs = require('fs');
const path = require('path');

function printUsage() {
  console.log(`
Zii Chat Batch Export Tool
===========================

Usage:
  node export-batch.js <batch-file.json> [options]

Options:
  --format <type>    Output format: csv, txt, pdf (default: csv)
  --output <file>    Output filename (default: auto-generated)
  --unused-only      Export only unused codes
  --with-qr          Include QR codes (for PDF format)

Examples:
  node export-batch.js batch-30days-1-2025-11-28T14-04-20.json
  node export-batch.js batch-30days-1-2025-11-28T14-04-20.json --format txt --unused-only
  node export-batch.js batch-30days-1-2025-11-28T14-04-20.json --format pdf --with-qr
  `);
}

function exportToCSV(codes, outputFile) {
  const csv = ['Code,Duration (Days),Status,Generated,Used'];
  
  codes.forEach(item => {
    csv.push(`${item.code},${item.durationDays},${item.used ? 'Used' : 'Available'},${item.generated},${item.used}`);
  });
  
  fs.writeFileSync(outputFile, csv.join('\n'));
  console.log(`✅ Exported ${codes.length} codes to ${outputFile}`);
}

function exportToTXT(codes, outputFile) {
  const lines = [
    'ZII CHAT ACTIVATION CODES',
    '='.repeat(50),
    `Generated: ${new Date().toLocaleString()}`,
    `Total Codes: ${codes.length}`,
    `Duration: ${codes[0]?.durationDays || 0} days`,
    '='.repeat(50),
    '',
    'CODES:',
    ''
  ];
  
  codes.forEach((item, idx) => {
    lines.push(`${(idx + 1).toString().padStart(3, '0')}. ${item.code}`);
  });
  
  lines.push('');
  lines.push('='.repeat(50));
  lines.push('Instructions:');
  lines.push('1. Enter code in Zii Chat app');
  lines.push('2. Connect to WiFi within 1 hour');
  lines.push('3. Code will be validated automatically');
  lines.push('');
  lines.push('Support: ziichat.com');
  
  fs.writeFileSync(outputFile, lines.join('\n'));
  console.log(`✅ Exported ${codes.length} codes to ${outputFile}`);
}

function exportToPrintable(codes, outputFile) {
  // Create a simple HTML file for printing
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Zii Chat Activation Codes</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #00ff88;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1a1a2e;
      margin: 0;
    }
    .info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .code-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .code-card {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      background: white;
    }
    .code-number {
      color: #666;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .code-value {
      font-size: 18px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 2px;
    }
    .code-duration {
      color: #00ff88;
      font-size: 14px;
      margin-top: 5px;
    }
    .instructions {
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }
    .instructions h3 {
      margin-top: 0;
      color: #856404;
    }
    .instructions ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #666;
    }
    @media print {
      .code-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      body {
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 ZII CHAT</h1>
    <p>Activation Codes</p>
  </div>
  
  <div class="info">
    <strong>Batch Information:</strong><br>
    Generated: ${new Date().toLocaleString()}<br>
    Total Codes: ${codes.length}<br>
    Duration: ${codes[0]?.durationDays || 0} days<br>
    Price: R${codes[0]?.durationDays === 10 ? 5 : codes[0]?.durationDays === 30 ? 15 : codes[0]?.durationDays === 90 ? 50 : 150}
  </div>
  
  <div class="code-grid">
    ${codes.map((item, idx) => `
      <div class="code-card">
        <div class="code-number">#${(idx + 1).toString().padStart(3, '0')}</div>
        <div class="code-value">${item.code}</div>
        <div class="code-duration">${item.durationDays} days</div>
      </div>
    `).join('')}
  </div>
  
  <div class="instructions">
    <h3>📱 Activation Instructions</h3>
    <ol>
      <li>Download Zii Chat from ziichat.com</li>
      <li>Open the app and enter your activation code</li>
      <li>Connect to WiFi within 1 hour to complete activation</li>
      <li>Enjoy secure, private messaging!</li>
    </ol>
  </div>
  
  <div class="footer">
    <p><strong>Support:</strong> ziichat.com | <strong>Email:</strong> support@ziichat.com</p>
    <p>© 2025 Zii Chat. All rights reserved.</p>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(outputFile, html);
  console.log(`✅ Exported ${codes.length} codes to ${outputFile}`);
  console.log(`   Open in browser and print to PDF`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    printUsage();
    return;
  }
  
  const batchFile = args[0];
  
  if (!fs.existsSync(batchFile)) {
    console.error(`❌ Error: File not found: ${batchFile}`);
    return;
  }
  
  // Parse options
  let format = 'csv';
  let outputFile = null;
  let unusedOnly = false;
  let withQR = false;
  
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--format' && args[i + 1]) {
      format = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    } else if (args[i] === '--unused-only') {
      unusedOnly = true;
    } else if (args[i] === '--with-qr') {
      withQR = true;
    }
  }
  
  // Load batch data
  console.log(`\n📦 Loading batch: ${batchFile}\n`);
  const batchData = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
  
  let codes = batchData.codes || [];
  
  // Filter unused only
  if (unusedOnly) {
    codes = codes.filter(c => !c.used);
    console.log(`   Filtered to ${codes.length} unused codes`);
  }
  
  if (codes.length === 0) {
    console.error('❌ No codes to export');
    return;
  }
  
  // Generate output filename if not provided
  if (!outputFile) {
    const baseName = path.basename(batchFile, '.json');
    const extension = format === 'pdf' ? 'html' : format;
    outputFile = `${baseName}-export.${extension}`;
  }
  
  // Export based on format
  console.log(`\n📄 Exporting to ${format.toUpperCase()} format...\n`);
  
  switch (format.toLowerCase()) {
    case 'csv':
      exportToCSV(codes, outputFile);
      break;
    case 'txt':
      exportToTXT(codes, outputFile);
      break;
    case 'pdf':
    case 'html':
      exportToPrintable(codes, outputFile);
      break;
    default:
      console.error(`❌ Unknown format: ${format}`);
      console.log('   Supported formats: csv, txt, pdf');
      return;
  }
  
  console.log(`\n✨ Export complete!\n`);
}

if (require.main === module) {
  main();
}

module.exports = { exportToCSV, exportToTXT, exportToPrintable };
