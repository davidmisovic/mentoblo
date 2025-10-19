# Mentoblo - Professional Tutoring Platform

Mentoblo is an all-in-one platform for independent tutors that helps them win clients, automate admin, and teach smarter with AI.

## Features

- **Student Management**: Add and manage student information, subjects, and progress tracking
- **Scheduling**: Book lessons and consultations with integrated calendar
- **AI-Powered Tools**: 
  - Lesson plan generator using Gemini AI
  - Parent report generator
  - Progress assessment tools
- **Invoicing**: Create and manage invoices with Stripe payment integration
- **Dashboard**: Overview of your tutoring business with key metrics
- **Authentication**: Secure user authentication with Supabase

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/davidmisovic/mentoblo.git
cd mentoblo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

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

### 4. Database Setup

Run the SQL commands in `lib/database.sql` in your Supabase SQL editor to set up the database schema, tables, and Row Level Security policies.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
mentoblo/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── students/     # Student management
│   │   ├── lessons/      # Lesson scheduling
│   │   ├── ai/           # AI tools (lesson plans, reports)
│   │   └── stripe/       # Payment processing
│   ├── dashboard/        # Main dashboard
│   ├── students/         # Student management pages
│   ├── scheduling/       # Calendar and booking
│   ├── invoicing/       # Invoice management
│   ├── ai/              # AI tools interface
│   ├── signin/          # Sign in page
│   ├── signup/          # Sign up page
│   └── page.tsx         # Landing page
├── lib/                  # Utility functions
│   ├── supabase.ts      # Supabase client configuration
│   └── database.sql     # Database schema
├── components/           # Reusable components
└── public/              # Static assets
```

## Key Features Implementation

### Authentication
- User registration and login with Supabase Auth
- Protected routes and middleware
- Session management

### Student Management
- Add/edit student information
- Subject tracking
- Parent/guardian contact details
- Student progress tracking

### AI Integration
- **Lesson Plan Generator**: Creates detailed lesson plans based on subject, level, and learning objectives
- **Parent Report Generator**: Generates professional progress reports for parents
- Uses Google Gemini AI for content generation

### Payment Processing
- Stripe integration for lesson payments
- Invoice generation and management
- Payment tracking and status updates

### Database Schema
- **Users/Profiles**: User account information
- **Students**: Student records and information
- **Lessons**: Scheduled lessons and sessions
- **Consultations**: Initial consultation bookings
- **Invoices**: Payment and billing records
- **AI Reports**: Generated content storage

## API Endpoints

### Authentication
- `POST /api/auth/callback` - OAuth callback handler

### Students
- `GET /api/students` - List all students for authenticated user
- `POST /api/students` - Create new student

### Lessons
- `GET /api/lessons` - List lessons with optional date filtering
- `POST /api/lessons` - Create new lesson

### AI Tools
- `POST /api/ai/lesson-plan` - Generate lesson plan
- `POST /api/ai/parent-report` - Generate parent report

### Payments
- `POST /api/stripe/create-payment-intent` - Create Stripe payment intent

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

### Environment Variables for Production
Make sure to set all environment variables in your production environment, including:
- Supabase URL and keys
- Stripe keys (use live keys for production)
- Gemini AI API key
- NextAuth configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

