# SEObot Integration Setup Guide

This guide will help you set up and run the integrated SEObot application.

## Prerequisites

- Node.js 20.11.1 or higher
- npm or pnpm package manager
- Supabase account (for database and authentication)
- OpenAI API key (for AI content generation)

## Step 1: Install Dependencies

Navigate to the project directory and install all dependencies:

```bash
cd saasai-dev-starter-kit-main
npm install
```

Or if you prefer pnpm:

```bash
cd saasai-dev-starter-kit-main
pnpm install
```

## Step 2: Set Up Supabase

1. **Create a Supabase Project**:
   - Go to https://supabase.com
   - Create a new project
   - Wait for the project to be fully provisioned

2. **Get Your Supabase Credentials**:
   - Go to Project Settings → API
   - Copy the following:
     - `Project URL` (this is your `NEXT_PUBLIC_SUPABASE_URL`)
     - `anon public` key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
     - `service_role` key (this is your `SUPABASE_SERVICE_ROLE_KEY`)

3. **Run Database Migrations**:
   ```bash
   # Link your Supabase project (if using local Supabase)
   npx supabase link --project-ref your-project-ref
   
   # Or apply migrations directly to your remote database
   # Go to Supabase Dashboard → SQL Editor and run the migration file:
   # supabase/migrations/20250101000000_seobot_schema.sql
   ```

4. **Enable OAuth Provider (Google)**:
   - Go to Authentication → Providers in Supabase Dashboard
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Add `http://localhost:3000/auth/callback` to Redirect URLs

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the `saasai-dev-starter-kit-main` directory with the following content:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Other configurations (if you want to use Stripe, Resend, etc.)
# STRIPE_SECRET_KEY=sk_test_...
# RESEND_API_KEY=re_...
# CRISP_WEBSITE_ID=your-crisp-id
```

**Important**: 
- Replace all placeholder values with your actual credentials
- Never commit `.env.local` to version control
- The `.env.local` file is already in `.gitignore`

## Step 4: Run Database Migration

If you haven't already, apply the database migration:

**Option A: Using Supabase CLI (Recommended)**
```bash
npx supabase migration up
```

**Option B: Manual SQL Execution**
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/20250101000000_seobot_schema.sql`
3. Paste and run it in the SQL Editor

This will create:
- `projects` table (stores website research and content plans)
- `articles` table (stores generated articles)
- Row Level Security (RLS) policies for data isolation

## Step 5: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Or with pnpm:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Step 6: Test the Application

1. **Landing Page**: Visit `http://localhost:3000` - you should see the SEObot landing page with MatrixRain animation

2. **Authentication**:
   - Click "Try now" button → Auth modal appears
   - Test OAuth: Click "Sign in with Google" (requires Google OAuth setup)
   - Test Quick Access: Click "Quick Access" → Enter name and email → Creates account and redirects to `/app`

3. **App Functionality**:
   - After authentication, you'll be redirected to `/app`
   - Enter a website URL in the chat (e.g., `https://example.com`)
   - Wait for analysis to complete
   - Review the content plan
   - Click "Proceed" to generate articles

## Troubleshooting

### Issue: "Please check your email to confirm your account"
**Solution**: Email confirmation is still enabled in Supabase. You MUST disable it:
1. Go to Supabase Dashboard → Authentication → Providers → Email
2. Set "Confirm email" to **DISABLED**
3. Save and restart your dev server
4. See `SUPABASE_CONFIG_INSTRUCTIONS.md` for detailed steps

### Issue: "OPENAI_API_KEY environment variable is not set"
**Solution**: Make sure your `.env.local` file exists and contains `OPENAI_API_KEY=sk-...`

### Issue: 401 Unauthorized error when analyzing website
**Solution**: 
- Check if you're logged in: Try refreshing `/app` page - if it redirects to home, you're logged out
- Check browser console for auth errors: Look for "Unauthorized" or session errors
- Check terminal logs: Look for `❌ /api/analyze - Unauthorized` with details
- Verify `.env.local` has correct Supabase credentials
- Try logging out and logging in again with Quick Access or Google OAuth
- Check cookies are enabled in your browser

**Debug Steps**:
1. Open browser DevTools → Network tab
2. Try analyzing a website
3. Look at the `/api/analyze` request
4. Check if cookies are being sent (Cookies section in request headers)
5. Check terminal for detailed auth check logs

### Issue: Database errors (projects/articles tables not found)
**Solution**: Run the database migration (Step 4)

### Issue: OAuth redirect not working
**Solution**: 
- Make sure `http://localhost:3000/auth/callback` is added to your OAuth provider's redirect URLs
- Check Supabase Dashboard → Authentication → URL Configuration

### Issue: MatrixRain or animations not showing
**Solution**: 
- Make sure all dependencies are installed: `npm install`
- Check browser console for errors
- Try clearing browser cache

### Issue: Landing page shows missing component errors
**Solution**: 
- Make sure you've pulled the latest code
- Run `npm install` to ensure all dependencies are installed
- The project has been cleaned of unnecessary template files

## Project Structure

```
saasai-dev-starter-kit-main/
├── app/
│   ├── (main)/          # Landing page route group
│   │   └── page.tsx     # Landing page (Seobot components)
│   ├── app/             # Protected app route
│   │   ├── page.tsx     # Main app page
│   │   └── components/  # App-specific components
│   └── api/             # API routes
│       ├── analyze/     # Website analysis endpoint
│       ├── chat/        # Chat/conversation endpoint
│       └── generate/    # Article generation endpoint
├── components/          # Shared components
│   ├── AuthForms/       # Authentication components
│   └── ui/              # UI components
├── hooks/               # React hooks
│   └── useChat.ts       # Chat state management
├── lib/                 # Library code
│   ├── api.ts           # API client
│   ├── types/           # TypeScript types
│   └── mappers/         # Data mappers
├── utils/               # Utility functions
│   ├── database/        # Database operations
│   ├── openai/          # OpenAI client
│   └── supabase/        # Supabase utilities
└── supabase/
    └── migrations/      # Database migrations
```

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended):
   - Connect your GitHub repository to Vercel
   - Add all environment variables in Vercel dashboard
   - Deploy

3. **Update OAuth Redirect URLs**:
   - Add your production URL (e.g., `https://yourdomain.com/auth/callback`) to:
     - Supabase Dashboard → Authentication → URL Configuration
     - Google OAuth Console → Authorized redirect URIs

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal/command prompt for server errors
3. Verify all environment variables are set correctly
4. Ensure database migrations have been applied

## Notes

- The app uses `gpt-4o-mini` model (you can change this in `utils/openai/client.ts`)
- All user data is isolated using Row Level Security (RLS)
- Projects and articles are stored per user in Supabase
- The Quick Access flow creates a proper Supabase auth user (not a temporary one)
