# SEObot Testing Guide

## Prerequisites

Before testing, ensure:

1. ✅ Supabase email confirmation is **DISABLED** (see `SUPABASE_CONFIG_INSTRUCTIONS.md`)
2. ✅ `.env.local` file exists with all required variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
3. ✅ Database migrations have been applied
4. ✅ Development server is running: `npm run dev`

## Test 1: Quick Access Authentication

### Steps:
1. Open http://localhost:3000
2. Click "Try now" button
3. Click "Quick Access (No OAuth required)"
4. Enter:
   - Name: "Test User"
   - Email: "test@example.com" (use unique email each time)
5. Click "Continue"

### Expected Results:
- ✅ No "check your email" message appears
- ✅ Modal closes automatically
- ✅ Page redirects to `/app`
- ✅ User sees the chat interface (no "Loading..." stuck state)
- ✅ Browser console shows: `✓ Session created immediately - redirecting to /app`

### If Failed:
- Check browser console for errors
- Check terminal for `⚠ Email confirmation is still required` message
- If you see this message, go to Supabase Dashboard and disable email confirmation
- Try with a different email address

---

## Test 2: Google OAuth Authentication

### Steps:
1. Open http://localhost:3000
2. Click "Try now" button
3. Click "Sign in with Google"
4. Complete Google OAuth flow

### Expected Results:
- ✅ OAuth flow completes successfully
- ✅ Redirects to `/app` page
- ✅ User sees chat interface

---

## Test 3: Website Analysis (401 Error Fix)

### Prerequisites:
- Must be logged in (complete Test 1 or Test 2 first)
- Must be on `/app` page

### Steps:
1. In the chat input, type a website URL: `https://example.com`
2. Press Enter or click Send
3. Wait for analysis to complete (may take 30-60 seconds)

### Expected Results:
- ✅ No 401 Unauthorized error
- ✅ Terminal shows:
   ```
   🔍 /api/analyze - Auth check: { hasUser: true, userId: '...', ... }
   ✓ /api/analyze - User authenticated: test@example.com
   🌐 /api/analyze - Processing URL: https://example.com
   ```
- ✅ Right panel shows "Website Analysis Results"
- ✅ Content plan with 5+ article topics appears
- ✅ "Proceed" button is visible

### If Failed (401 Error):
- Check browser console for auth errors
- Check if cookies are being sent (Network tab → /api/analyze → Cookies)
- Verify user is still logged in: Check `/app` page doesn't redirect to `/signin`
- Try refreshing the page and attempting again

---

## Test 4: Article Generation

### Prerequisites:
- Must have completed Test 3 successfully
- Content plan must be visible in right panel

### Steps:
1. Click "Proceed" button in the right panel
2. Wait for article generation (may take 60-120 seconds)

### Expected Results:
- ✅ "Generating articles... Please wait." message appears at top
- ✅ Terminal shows generation progress
- ✅ Generated articles appear in the right panel
- ✅ Articles are formatted in Markdown
- ✅ No 401 errors in console

---

## Test 5: Chat Refinement

### Prerequisites:
- Must have completed Test 3 (analysis complete)

### Steps:
1. In chat input, type: "Add a topic about SEO best practices"
2. Press Enter
3. Wait for response

### Expected Results:
- ✅ Bot responds with confirmation
- ✅ Content plan updates with new topic
- ✅ No errors in console

---

## Test 6: Session Persistence

### Steps:
1. Complete Test 1 (login via Quick Access)
2. Wait 2-3 minutes
3. Enter a website URL for analysis
4. Refresh the page (F5)
5. Enter another website URL

### Expected Results:
- ✅ No redirect to `/signin` after refresh
- ✅ User stays logged in
- ✅ Website analysis works after refresh (no 401)
- ✅ Session persists across page refreshes

---

## Test 7: Database Verification

### Steps:
1. Complete Tests 1-4
2. Go to Supabase Dashboard → Table Editor
3. Check tables:
   - `users` - Should have your test user
   - `projects` - Should have analyzed website data
   - `articles` - Should have generated articles

### Expected Results:
- ✅ `users` table has entry with `full_name` = "Test User"
- ✅ `projects` table has entry with analyzed URL
- ✅ `projects.research_data` contains JSON with site info
- ✅ `projects.plan` contains array of content topics
- ✅ `articles` table has generated article entries
- ✅ All entries have correct `user_id` matching your test user

---

## Common Issues & Solutions

### Issue: "Please check your email to confirm"
**Solution**: Email confirmation is still enabled in Supabase. Follow `SUPABASE_CONFIG_INSTRUCTIONS.md`

### Issue: 401 Unauthorized on /api/analyze
**Possible Causes**:
1. **Session not created** - Check Quick Access flow completes successfully
2. **Cookies not sent** - Check Network tab → /api/analyze → Cookies header
3. **Session expired** - Try logging in again

**Debug Steps**:
1. Check browser console for auth errors
2. Check terminal for `❌ /api/analyze - Unauthorized` message
3. Check if `auth.getUser()` returns user in console:
   ```js
   // In browser console on /app page:
   const supabase = window.supabase // if exposed
   const { data } = await supabase.auth.getUser()
   console.log(data)
   ```

### Issue: Stuck on "Loading..." on /app page
**Solution**: 
1. Check if auth check is failing
2. Open browser console for errors
3. Verify `.env.local` has correct Supabase credentials
4. Try logging out and logging in again

### Issue: Articles not generating
**Possible Causes**:
1. **Invalid OpenAI API key** - Check `.env.local`
2. **OpenAI rate limits** - Wait and try again
3. **Network errors** - Check terminal for OpenAI errors

---

## Testing Checklist

Use this checklist to verify all functionality:

- [ ] Quick Access signup works without email verification
- [ ] Google OAuth works
- [ ] User redirects to `/app` after login
- [ ] Website URL analysis succeeds (no 401)
- [ ] Content plan appears in right panel
- [ ] "Proceed" button generates articles
- [ ] Generated articles display correctly
- [ ] Chat refinement updates content plan
- [ ] Session persists after page refresh
- [ ] User data saved in Supabase `users` table
- [ ] Project data saved in Supabase `projects` table
- [ ] Articles saved in Supabase `articles` table
- [ ] Multiple website analyses work for same user
- [ ] Logout functionality works

---

## Performance Notes

**Expected Timing**:
- Quick Access signup: 1-2 seconds
- OAuth redirect: 2-3 seconds
- Website analysis: 30-60 seconds (OpenAI calls)
- Article generation: 60-120 seconds per article (OpenAI calls)
- Chat response: 5-10 seconds

**If slower**:
- Check internet connection
- Check OpenAI API status
- Check Supabase project status
- Monitor terminal for bottlenecks
