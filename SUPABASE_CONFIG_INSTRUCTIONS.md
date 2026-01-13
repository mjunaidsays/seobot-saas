# Supabase Configuration Instructions

## CRITICAL: Disable Email Confirmation

To allow users to sign up with Quick Access (name + email) without requiring email verification:

### Steps:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: Authentication → Providers → Email
4. **Find**: "Confirm email" setting
5. **Set to**: **DISABLED** or **OFF**
6. **Save changes**

### Alternative Path:

1. Go to: Authentication → Settings
2. Find: "Enable email confirmations"
3. Toggle: **OFF**

### Why this is needed:

- By default, Supabase requires users to confirm their email before creating a session
- This causes the "Please check your email" message in the Quick Access flow
- Disabling this allows instant sign-up and redirect to /app
- Users will get a session immediately after signup without email verification

### Security Note:

This is appropriate for Quick Access flow where:
- Users just enter name + email
- No password is visible to users (auto-generated)
- OAuth (Google) is still available as a more secure option
- This mimics a "guest access" pattern common in SaaS apps

---

**Once configured, restart the Next.js dev server to ensure changes take effect.**
