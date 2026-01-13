# Troubleshooting Guide

## "Failed to fetch" Error

If you're getting a "Failed to fetch" error when trying to sign up or sign in, check the following:

### 1. Check Environment Variables

Make sure your `.env.local` file exists and contains all required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
```

**Important**: 
- The file must be named `.env.local` (not `.env` or `.env.local.txt`)
- It must be in the `saasai-dev-starter-kit-main` directory (same level as `package.json`)
- No spaces around the `=` sign
- No quotes needed around values

### 2. Restart Development Server

After creating or modifying `.env.local`, you MUST restart the dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts!

### 3. Verify Supabase Project is Active

1. Go to https://supabase.com/dashboard
2. Check that your project status is "Active"
3. If paused, click "Restore" to reactivate

### 4. Check Supabase URL Format

Your Supabase URL should look like:
```
https://xxxxxxxxxxxxx.supabase.co
```

NOT:
```
https://supabase.com/project/xxxxx
```

### 5. Verify API Keys

1. Go to Supabase Dashboard → Settings → API
2. Copy the values directly (don't type them manually)
3. Make sure you're copying:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 6. Check Browser Console

Open browser DevTools (F12) → Console tab and look for:
- Network errors
- CORS errors
- Specific error messages

### 7. Test Supabase Connection

Create a test file `test-supabase.js` in the project root:

```javascript
// test-supabase.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl ? 'Set ✓' : 'Missing ✗')
console.log('Key:', supabaseKey ? 'Set ✓' : 'Missing ✗')

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey)
  supabase.from('users').select('count').limit(1)
    .then(() => console.log('Connection: Success ✓'))
    .catch(err => console.log('Connection: Failed ✗', err.message))
}
```

Run: `node test-supabase.js`

### 8. Common Issues

**Issue**: "Invalid API key"
- Solution: Check that you copied the correct key (anon key, not service role)

**Issue**: "Network request failed"
- Solution: Check your internet connection and Supabase project status

**Issue**: "CORS error"
- Solution: Make sure your Supabase project allows requests from `http://localhost:3000`

**Issue**: Environment variables not loading
- Solution: 
  1. Restart dev server
  2. Check file is named `.env.local` (not `.env.local.txt`)
  3. Check file is in correct directory
  4. Check for typos in variable names

### 9. Quick Fix Checklist

- [ ] `.env.local` file exists in `saasai-dev-starter-kit-main/` directory
- [ ] All 4 required variables are set
- [ ] No typos in variable names (case-sensitive!)
- [ ] Dev server was restarted after creating `.env.local`
- [ ] Supabase project is active (not paused)
- [ ] Copied values directly from Supabase dashboard (didn't type manually)
- [ ] Browser console shows no CORS errors

### 10. Still Not Working?

1. Check the exact error message in browser console
2. Verify Supabase project is accessible: Visit `https://your-project.supabase.co` in browser
3. Check Supabase logs: Dashboard → Logs → API Logs
4. Try creating a new Supabase project and updating `.env.local`
