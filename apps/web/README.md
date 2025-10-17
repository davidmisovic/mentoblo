# Mentoblo Web Application

A modern SaaS platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
   - Run the SQL schema in `supabase/schema.sql` in your Supabase dashboard
   - Or use the Supabase CLI to apply the schema

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication routes
│   ├── dashboard/      # Protected dashboard pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
│   ├── auth/          # Authentication components
│   └── ui/            # Shadcn/UI components
├── lib/               # Utilities and configurations
│   └── supabase/      # Supabase client configurations
└── types/             # TypeScript type definitions
```

## Features

- ✅ User authentication with Supabase Auth
- ✅ Protected routes with middleware
- ✅ Modern UI with Shadcn/UI components
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Responsive design
- ✅ Server-side rendering

## Deployment

This application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Database Schema

The application uses a profiles table with role-based user management:

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT,
  public_handle TEXT UNIQUE,
  user_role TEXT NOT NULL DEFAULT 'student'
);
```

### Key Features:
- **Role-based system**: Users can be 'tutor' or 'student'
- **Public handles**: Unique identifiers for public profiles
- **Automatic profile creation**: Trigger creates profile on user signup
- **Row Level Security**: Secure data access policies
- **Avatar storage**: Integrated with Supabase Storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
