# Vercel Environment Variables Setup

This document lists all the environment variables needed for deploying the Mentoblo tutoring platform to Vercel.

## Required Environment Variables

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

### Stripe Configuration
- `STRIPE_SECRET_KEY` - Your Stripe secret key (server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

### Gemini AI Configuration
- `GEMINI_API_KEY` - Your Google Gemini API key

### App Configuration
- `NEXTAUTH_URL` - Your app URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET` - A random secret string for NextAuth

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its corresponding value
5. Make sure to set the correct environment (Production, Preview, Development)

## Security Notes

- Never commit `.env` files to your repository
- Use different API keys for development and production
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Variables without this prefix are server-side only

## Example .env.local for Development

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```
