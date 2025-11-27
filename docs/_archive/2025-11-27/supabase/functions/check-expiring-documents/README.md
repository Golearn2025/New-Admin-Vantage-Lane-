# Check Expiring Documents - Edge Function

Automated daily check for expiring documents (driver & vehicle).

## What it does

- Checks for documents expiring within 7 days
- Sends notifications to drivers about their expiring documents
- Sends notifications to admins about expiring driver/vehicle documents
- Prevents duplicate notifications (only sends once per day per document)

## How to activate

### Option 1: Deploy Edge Function (RECOMMENDED)

```bash
# Deploy to Supabase
supabase functions deploy check-expiring-documents

# Set up CRON in Supabase Dashboard:
# 1. Go to Database → Functions → Edge Functions
# 2. Find check-expiring-documents
# 3. Click "Add Cron Schedule"
# 4. Set: 0 9 * * * (daily at 9:00 AM UTC)
# 5. Save
```

### Option 2: External CRON (GitHub Actions, Vercel Cron, etc.)

```yaml
# .github/workflows/check-documents-cron.yml
name: Check Expiring Documents

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC

jobs:
  check-documents:
    runs-on: ubuntu-latest
    steps:
      - name: Call Edge Function
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://YOUR_PROJECT_ID.supabase.co/functions/v1/check-expiring-documents
```

### Option 3: Manual Call (Testing)

```bash
# Test the function locally
supabase functions serve check-expiring-documents

# Call it manually
curl -X POST http://localhost:54321/functions/v1/check-expiring-documents \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Environment Variables

Required in Supabase Edge Function settings:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-random-secret (optional, for auth)
```

## Database Function

The Edge Function calls this database function:

```sql
SELECT check_expiring_documents();
```

You can also call this function directly from SQL if needed.

## Testing

```sql
-- Check if documents are expiring soon
SELECT 
  document_type,
  expiry_date,
  expiry_date - CURRENT_DATE as days_until_expiry
FROM driver_documents
WHERE expiry_date <= CURRENT_DATE + INTERVAL '7 days'
  AND expiry_date > CURRENT_DATE
  AND status = 'approved';

-- Run the function manually
SELECT check_expiring_documents();

-- Check notifications created
SELECT * FROM notifications
WHERE type IN ('document_expiring', 'driver_document_expiring')
ORDER BY created_at DESC
LIMIT 10;
```

## Schedule Recommendation

- **9:00 AM UTC** = Good time for most timezones
- **Daily** = Prevents spam while keeping drivers informed
- **7 days warning** = Enough time to renew documents
