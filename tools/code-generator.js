/**
 * Zii Chat Activation Code Generator
 * 
 * Code Format: XXXX-YYYY-ZZZZ-CCCC
 * - XXXX: Random prefix (4 chars)
 * - YYYY: Encoded duration + batch (4 chars)
 * - ZZZZ: Unique code ID (4 chars)
 * - CCCC: Checksum (4 chars)
 */

const crypto = require('crypto');
const fs = require('fs');

// Secret key for checksum (CHANGE THIS IN PRODUCTION!)
const SECRET_KEY = process.env.CODE_SECRET_KEY || 'zii-chat-secret-2024';

/**
 * Encode duration and batch ID into 4 characters
 */
function encodeDuration(days, batchId) {
    // Encode days in first 2 chars (hex) - max 255 days
    // For 365 days, use special encoding: FF = 365
    let daysHex;
    if (days >= 365) {
        daysHex = 'FF'; // Special code for 365 days
    } else if (days > 255) {
        daysHex = 'FE'; // Special code for >255 days
    } else {
        daysHex = days.toString(16).padStart(2, '0').toUpperCase();
    }
    
    // Encode batch in last 2 chars (hex)
    const batchHex = (batchId % 256).toString(16).padStart(2, '0').toUpperCase();
    
    return daysHex + batchHex;
}

/**
 * Decode duration from encoded string
 */
function decodeDuration(encoded) {
    const daysHex = encoded.substring(0, 2);
    
    // Handle special encodings
    if (daysHex === 'FF') return 365;
    if (daysHex === 'FE') return 256;
    
    return parseInt(daysHex, 16);
}

/**
 * Calculate checksum for code validation
 */
function calculateChecksum(data) {
    return crypto
        .createHash('sha256')
        .update(data + SECRET_KEY)
        .digest('hex')
        .substring(0, 4)
        .toUpperCase();
}

/**
 * Validate code format and checksum
 */
function validateCode(code) {
    // Check format
    const codeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!codeRegex.test(code)) {
        return { valid: false, error: 'Invalid format' };
    }
    
    // Split code
    const parts = code.split('-');
    const [prefix, encoded, uniqueId, checksum] = parts;
    
    // Verify checksum
    const expectedChecksum = calculateChecksum(prefix + encoded + uniqueId);
    if (checksum !== expectedChecksum) {
        return { valid: false, error: 'Invalid checksum' };
    }
    
    // Decode duration
    const durationDays = decodeDuration(encoded);
    
    return {
        valid: true,
        durationDays,
        prefix,
        uniqueId
    };
}

/**
 * Generate a single activation code
 */
function generateCode(durationDays, batchId) {
    // Random prefix (4 chars)
    const prefix = crypto.randomBytes(2).toString('hex').toUpperCase();
    
    // Encode duration + batch (4 chars)
    const encoded = encodeDuration(durationDays, batchId);
    
    // Unique ID (4 chars)
    const uniqueId = crypto.randomBytes(2).toString('hex').toUpperCase();
    
    // Calculate checksum (4 chars)
    const checksum = calculateChecksum(prefix + encoded + uniqueId);
    
    return `${prefix}-${encoded}-${uniqueId}-${checksum}`;
}

/**
 * Generate a batch of activation codes
 */
function generateBatch(count, durationDays, batchId) {
    const codes = [];
    const startTime = Date.now();
    
    console.log(`\n🔧 Generating ${count} codes for ${durationDays} days (Batch #${batchId})...`);
    
    for (let i = 0; i < count; i++) {
        const code = generateCode(durationDays, batchId);
        codes.push({
            code,
            durationDays,
            batchId,
            generated: new Date().toISOString(),
            used: false
        });
        
        // Progress indicator
        if ((i + 1) % 10 === 0 || i === count - 1) {
            process.stdout.write(`\r   Progress: ${i + 1}/${count} codes`);
        }
    }
    
    const elapsed = Date.now() - startTime;
    console.log(`\n✅ Generated ${count} codes in ${elapsed}ms\n`);
    
    return codes;
}

/**
 * Save batch to JSON file
 */
function saveBatch(codes, filename) {
    const data = {
        generated: new Date().toISOString(),
        count: codes.length,
        durationDays: codes[0].durationDays,
        batchId: codes[0].batchId,
        codes: codes
    };
    
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`💾 Saved to: ${filename}`);
}

/**
 * Save batch to CSV file (for printing/distribution)
 */
function saveBatchCSV(codes, filename) {
    const csv = ['Code,Duration (Days),Batch ID,Generated,Used'];
    
    codes.forEach(item => {
        csv.push(`${item.code},${item.durationDays},${item.batchId},${item.generated},${item.used}`);
    });
    
    fs.writeFileSync(filename, csv.join('\n'));
    console.log(`📄 Saved CSV to: ${filename}`);
}

/**
 * CLI Interface
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === '--help') {
        console.log(`
Zii Chat Code Generator
========================

Usage:
  node code-generator.js generate <count> <days> <batchId>
  node code-generator.js validate <code>
  node code-generator.js test

Examples:
  node code-generator.js generate 100 30 1      # Generate 100 codes for 30 days, batch 1
  node code-generator.js validate ABCD-1E01-5678-9ABC
  node code-generator.js test                   # Run tests

Pricing Tiers:
  10 days  = R5
  30 days  = R15
  90 days  = R50
  365 days = R150
        `);
        return;
    }
    
    const command = args[0];
    
    switch (command) {
        case 'generate': {
            const count = parseInt(args[1]) || 10;
            const days = parseInt(args[2]) || 30;
            const batchId = parseInt(args[3]) || 1;
            
            const codes = generateBatch(count, days, batchId);
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            const jsonFile = `batch-${days}days-${batchId}-${timestamp}.json`;
            const csvFile = `batch-${days}days-${batchId}-${timestamp}.csv`;
            
            saveBatch(codes, jsonFile);
            saveBatchCSV(codes, csvFile);
            
            console.log(`\n📊 Summary:`);
            console.log(`   Codes: ${count}`);
            console.log(`   Duration: ${days} days`);
            console.log(`   Batch ID: ${batchId}`);
            console.log(`   Files: ${jsonFile}, ${csvFile}\n`);
            break;
        }
        
        case 'validate': {
            const code = args[1];
            if (!code) {
                console.error('❌ Error: Please provide a code to validate');
                return;
            }
            
            console.log(`\n🔍 Validating code: ${code}`);
            const result = validateCode(code);
            
            if (result.valid) {
                console.log(`✅ Valid code!`);
                console.log(`   Duration: ${result.durationDays} days`);
                console.log(`   Prefix: ${result.prefix}`);
                console.log(`   Unique ID: ${result.uniqueId}\n`);
            } else {
                console.log(`❌ Invalid code: ${result.error}\n`);
            }
            break;
        }
        
        case 'test': {
            console.log('\n🧪 Running tests...\n');
            
            // Test 1: Generate and validate
            console.log('Test 1: Generate and validate code');
            const testCode = generateCode(30, 1);
            console.log(`   Generated: ${testCode}`);
            const validation = validateCode(testCode);
            console.log(`   Valid: ${validation.valid ? '✅' : '❌'}`);
            console.log(`   Duration: ${validation.durationDays} days`);
            
            // Test 2: Invalid checksum
            console.log('\nTest 2: Invalid checksum detection');
            const invalidCode = testCode.substring(0, testCode.length - 1) + 'X';
            const invalidValidation = validateCode(invalidCode);
            console.log(`   Code: ${invalidCode}`);
            console.log(`   Valid: ${invalidValidation.valid ? '❌ FAIL' : '✅ PASS'}`);
            
            // Test 3: All tiers
            console.log('\nTest 3: Generate codes for all tiers');
            const tiers = [
                { days: 10, price: 'R5' },
                { days: 30, price: 'R15' },
                { days: 90, price: 'R50' },
                { days: 365, price: 'R150' }
            ];
            
            tiers.forEach(tier => {
                const code = generateCode(tier.days, 1);
                const val = validateCode(code);
                console.log(`   ${tier.price} (${tier.days} days): ${code} - ${val.valid ? '✅' : '❌'}`);
            });
            
            console.log('\n✅ All tests passed!\n');
            break;
        }
        
        default:
            console.error(`❌ Unknown command: ${command}`);
            console.log('Run with --help for usage information');
    }
}

// Export functions for use in other modules
module.exports = {
    generateCode,
    generateBatch,
    validateCode,
    encodeDuration,
    decodeDuration,
    calculateChecksum
};

// Run CLI if executed directly
if (require.main === module) {
    main();
}
