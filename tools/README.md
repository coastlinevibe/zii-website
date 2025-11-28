# Zii Chat Code Generator Tool

## Overview
Generates activation codes for Zii Chat with built-in validation and batch management.

## Installation
```bash
cd zii-website/tools
# No installation needed - uses Node.js built-in modules
```

## Usage

### Generate Codes
```bash
# Generate 100 codes for 30 days, batch 1
node code-generator.js generate 100 30 1

# Generate 50 codes for 10 days, batch 2
node code-generator.js generate 50 10 2
```

### Validate Code
```bash
node code-generator.js validate ABCD-1E01-5678-9ABC
```

### Run Tests
```bash
node code-generator.js test
```

## Pricing Tiers

| Duration | Price | Command |
|----------|-------|---------|
| 10 days  | R5    | `generate 100 10 1` |
| 30 days  | R15   | `generate 100 30 1` |
| 90 days  | R50   | `generate 100 90 1` |
| 365 days | R150  | `generate 100 365 1` |

## Output Files

### JSON Format
```json
{
  "generated": "2024-11-28T14:30:00.000Z",
  "count": 100,
  "durationDays": 30,
  "batchId": 1,
  "codes": [
    {
      "code": "ABCD-1E01-5678-9ABC",
      "durationDays": 30,
      "batchId": 1,
      "generated": "2024-11-28T14:30:00.000Z",
      "used": false
    }
  ]
}
```

### CSV Format
```csv
Code,Duration (Days),Batch ID,Generated,Used
ABCD-1E01-5678-9ABC,30,1,2024-11-28T14:30:00.000Z,false
```

## Code Format

```
XXXX-YYYY-ZZZZ-CCCC
│    │    │    └─ Checksum (4 chars)
│    │    └────── Unique ID (4 chars)
│    └─────────── Duration + Batch (4 chars)
└──────────────── Random prefix (4 chars)
```

## Security

- **Checksum**: SHA-256 hash prevents fake codes
- **Secret Key**: Set via `CODE_SECRET_KEY` environment variable
- **Validation**: Server-side validation required

### Set Secret Key (Production)
```bash
export CODE_SECRET_KEY="your-super-secret-key-here"
node code-generator.js generate 100 30 1
```

## Batch Management

### Batch ID Guidelines
- Use sequential IDs: 1, 2, 3, etc.
- Track batches for analytics
- Different batch per partner/channel

### Example Workflow
```bash
# Website sales - Batch 1
node code-generator.js generate 500 30 1

# Partner Shop A - Batch 2
node code-generator.js generate 100 30 2

# WhatsApp support - Batch 3
node code-generator.js generate 50 10 3
```

## Integration with Vercel

### Upload to Vercel KV
```javascript
const { kv } = require('@vercel/kv');
const batch = require('./batch-30days-1-2024-11-28.json');

async function uploadBatch() {
    for (const item of batch.codes) {
        await kv.set(`code:${item.code}`, {
            durationDays: item.durationDays,
            batchId: item.batchId,
            generated: item.generated,
            used: false
        });
    }
    console.log(`Uploaded ${batch.count} codes to Vercel KV`);
}

uploadBatch();
```

## Partner Distribution

### Physical Vouchers
1. Generate batch for partner
2. Export to CSV
3. Print vouchers with codes
4. Partner sells at retail price

### Digital Distribution
1. Generate batch
2. Send JSON file to partner
3. Partner distributes via their system

## Troubleshooting

### Invalid Checksum
- Ensure SECRET_KEY is consistent
- Don't modify generated codes manually

### Duplicate Codes
- Extremely unlikely (2^32 combinations per batch)
- If occurs, regenerate batch with new batch ID

## API Integration

See `/api/activate.js` for server-side validation logic.

---

**Last Updated**: 2024-11-28
