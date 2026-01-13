# SEObot - AI-Powered SEO Content Generator

SEObot is a Next.js-based AI application that analyzes websites and generates SEO-optimized content using OpenAI's GPT models. Built with Supabase for authentication and database, it provides a seamless experience for content creators.

## Features

✨ **Website Analysis**: Automatically research and analyze any website to understand its niche, audience, and SEO strategy

🤖 **AI Content Generation**: Generate high-quality, SEO-optimized articles based on website analysis

💬 **Interactive Chat**: Refine content plans through conversational AI

🔐 **Multiple Auth Options**: 
- Quick Access (name + email - no password required)
- Google OAuth

📊 **Database Integration**: Store projects, content plans, and generated articles in Supabase

🎨 **Modern UI**: Beautiful, responsive interface with dark mode and Matrix-inspired animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Framer Motion
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

- Node.js 20.11.1 or higher
- npm or pnpm
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd saasai-dev-starter-kit-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Supabase**
   
   See [SEOBOT_SETUP.md](SEOBOT_SETUP.md) for detailed instructions.
   
   Quick setup:
   - Create a Supabase project
   - Run the migrations in `supabase/migrations/`
   - **IMPORTANT**: Disable email confirmation (see [SUPABASE_CONFIG_INSTRUCTIONS.md](SUPABASE_CONFIG_INSTRUCTIONS.md))
   - Enable Google OAuth provider

4. **Configure environment variables**
   
   Create `.env.local` in the project root:
   
   ```env
   # Supabase (REQUIRED)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # OpenAI (REQUIRED)
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

5. **Run database migrations**
   
   Go to Supabase Dashboard → SQL Editor and run:
   - `supabase/migrations/20230530034630_init.sql`
   - `supabase/migrations/20250101000000_seobot_schema.sql`

6. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Authentication

- Click "Try now" on the landing page
- Choose either:
  - **Quick Access**: Enter name and email for instant access
  - **Google OAuth**: Sign in with your Google account

### 2. Analyze a Website

- After login, you'll be redirected to the app interface
- Enter any website URL in the chat input
- Wait 30-60 seconds for AI analysis
- Review the generated content plan in the right panel

### 3. Generate Content

- Click "Proceed" to generate articles based on the content plan
- Wait 1-2 minutes for article generation
- View and copy generated articles

### 4. Refine the Plan

- Chat with the AI to modify the content plan
- Example: "Add a topic about technical SEO"
- The plan updates automatically

## Project Structure

```
saasai-dev-starter-kit-main/
├── app/
│   ├── (main)/              # Landing page and public routes
│   │   ├── page.tsx         # Landing page
│   │   └── account/         # User account page
│   ├── app/                 # Protected app route
│   │   ├── page.tsx         # Main app interface
│   │   └── components/      # App-specific components
│   └── api/                 # API routes
│       ├── analyze/         # Website analysis endpoint
│       ├── chat/            # Chat/refinement endpoint
│       └── generate/        # Article generation endpoint
├── components/              # Shared components
│   ├── AuthForms/           # Authentication components
│   │   ├── SeobotAuthModal.tsx  # Main auth modal
│   │   └── OauthSignIn.tsx      # OAuth component
│   ├── HeroSeobot.tsx       # Landing page hero
│   ├── NavbarSeobot.tsx     # Navigation bar
│   └── ui/                  # UI primitives
├── utils/
│   ├── database/            # Database operations (projects, articles)
│   ├── openai/              # OpenAI client and prompts
│   ├── supabase/            # Supabase utilities
│   └── auth-helpers/        # Auth helper functions
├── lib/
│   ├── api.ts               # API client
│   └── types/               # TypeScript types
└── supabase/
    └── migrations/          # Database schema migrations
```

## API Routes

### POST /api/analyze
Analyzes a website and generates a content plan.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "research_data": {
    "audience": "...",
    "niche": "...",
    "core_keywords": [...],
    "tone": "...",
    "site_map": [...]
  },
  "plan": [
    {
      "title": "...",
      "main_keyword": "...",
      "lsi_keywords": [...],
      "word_count": 2500
    }
  ]
}
```

### POST /api/chat
Refines the content plan through conversation.

**Request:**
```json
{
  "session_id": "uuid",
  "message": "Add a topic about link building"
}
```

### POST /api/generate
Generates an article based on a topic.

**Request:**
```json
{
  "session_id": "uuid",
  "topic": "Ultimate Guide to Technical SEO",
  "word_count": 2500
}
```

## Database Schema

### users
Stores user profile information (name, email, etc.)

### projects
Stores website analysis and content plans
- `id`: UUID primary key
- `user_id`: References auth.users
- `url`: Analyzed website URL
- `research_data`: JSONB (site analysis)
- `plan`: JSONB (content plan array)
- `chat_history`: JSONB (conversation history)

### articles
Stores generated articles
- `id`: UUID primary key
- `project_id`: References projects
- `user_id`: References auth.users
- `topic`: Article topic
- `content`: Generated markdown content
- `keywords`: Array of keywords
- `word_count`: Article length

## Configuration

### Auth Settings

Edit `utils/auth-helpers/settings.ts`:

```typescript
const allowOauth = true     // Enable Google OAuth
const allowEmail = false    // Disable magic link (not used)
const allowPassword = false // Disable password auth (not used)
```

### OpenAI Model

Edit `utils/openai/client.ts` to change the AI model:

```typescript
model: 'gpt-4o-mini' // or 'gpt-4', 'gpt-4-turbo', etc.
```

## Troubleshooting

### Email Verification Required

**Problem**: "Please check your email to confirm your account" message appears after Quick Access signup.

**Solution**: Disable email confirmation in Supabase Dashboard → Authentication → Email → "Confirm email" = OFF

See [SUPABASE_CONFIG_INSTRUCTIONS.md](SUPABASE_CONFIG_INSTRUCTIONS.md) for detailed steps.

### 401 Unauthorized on /api/analyze

**Problem**: Getting 401 errors when analyzing websites.

**Solutions**:
1. Verify you're logged in (check `/app` doesn't redirect)
2. Check browser console for auth errors
3. Verify `.env.local` has correct Supabase credentials
4. Check terminal logs for detailed error messages
5. Try logging out and logging in again

### Articles Not Generating

**Problem**: Article generation fails or takes too long.

**Solutions**:
1. Check OpenAI API key in `.env.local`
2. Verify OpenAI account has credits
3. Check terminal for OpenAI API errors
4. Try with a smaller `word_count` value

### More Troubleshooting

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing and debugging instructions.

## Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add environment variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`

3. **Update OAuth redirect URLs**
   
   In Supabase Dashboard → Authentication → URL Configuration:
   - Add: `https://yourdomain.com/auth/callback`
   
   In Google Cloud Console → OAuth:
   - Add: `https://yourdomain.com/auth/callback`

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Development

### Running Tests

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for the complete testing checklist.

### Code Structure

- **Server Components**: Used for pages that need server-side data fetching
- **Client Components**: Used for interactive UI (`'use client'` directive)
- **API Routes**: Server-side functions for backend logic
- **Database Functions**: CRUD operations in `utils/database/`
- **OpenAI Integration**: Prompts and AI logic in `utils/openai/`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Check [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Review [SEOBOT_SETUP.md](SEOBOT_SETUP.md)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Database and Auth by [Supabase](https://supabase.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
