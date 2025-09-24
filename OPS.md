# Operations Checklist

## Supabase
1. In SQL editor, run packages/db/schema.sql (enables uuid extension, creates tables, and sets RLS).
2. Authentication -> URL configuration: set site URL to your deployment domain.
3. Providers: enable Google/GitHub and configure client IDs + secrets.
4. Verify RLS on profiles, subscriptions, focus_categories, daily_stats.

## Environment Variables (apps/web/.env.local and Vercel Project Settings)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY (optional until payments)
- STRIPE_WEBHOOK_SECRET (optional until payments)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (optional until payments)

## Vercel
1. Link repo and import project.
2. Preset: Next.js. Build: default.
3. Add env vars, then Deploy.

## Post-Deploy QA
- Calculator  / -> /result/[id] works and stores rows.
- Signup creates user and 14-day trial in subscriptions.
- Settings portfolio CRUD persists categories.
- Dashboard chart renders from daily_stats.

