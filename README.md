# Mentoblo - The All-in-One Tutoring Platform

**Win Clients, Automate Admin, and Teach Smarter.**

Mentoblo is a comprehensive SaaS platform designed specifically for independent tutors to streamline their business operations, automate administrative tasks, and focus on what they do best - teaching.

## 🚀 Features

### Core Platform
- **User Authentication**: Secure Google OAuth integration with Supabase Auth
- **Role-Based Access**: Separate experiences for tutors and students
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS
- **Real-time Updates**: Live data synchronization across the platform

### Tutor Dashboard
- **Command Center**: Comprehensive overview with KPIs and activity feeds
- **Booking Management**: Complete session lifecycle management
- **Availability Scheduling**: Flexible time slot management
- **Student Management**: Track and communicate with students

### AI-Powered Tools
- **Lesson Planner**: AI-generated lesson plans using Google Gemini
- **Feedback Generator**: Automated student progress reports
- **Smart Recommendations**: Personalized teaching suggestions

### Materials Library
- **File Management**: Upload and organize teaching resources
- **Student Assignment**: Share materials with specific students
- **Storage Integration**: Secure file storage with Supabase

### Virtual Classroom
- **Session Management**: Real-time session tracking
- **Shared Notes**: Collaborative note-taking during sessions
- **Meeting Integration**: Google Meet/Zoom link generation
- **Session Files**: Access to relevant materials during sessions

### Payment Processing
- **Stripe Connect**: Secure payment processing
- **Automated Invoicing**: Generate and track invoices
- **Revenue Tracking**: Monitor earnings and platform fees

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Modern component library
- **React Markdown** - Markdown rendering

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database with Row Level Security
- **Supabase Auth** - Authentication and authorization
- **Supabase Storage** - File storage and management

### AI Integration
- **Google Gemini API** - AI-powered content generation
- **Custom Prompts** - Optimized for educational content

### Payment Processing
- **Stripe Connect** - Payment processing and payouts
- **Webhook Integration** - Real-time payment updates

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── api/               # API routes
│   │   └── t/                 # Public tutor pages
│   ├── components/            # React components
│   │   ├── ai/               # AI-powered components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── materials/        # Materials library components
│   │   ├── sessions/         # Virtual classroom components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utility functions
│   │   ├── supabase/         # Supabase client configuration
│   │   ├── actions/          # Server actions
│   │   └── toast.ts          # Toast notifications
│   └── types/                # TypeScript type definitions
├── supabase/
│   └── complete-schema.sql     # Database schema
└── public/                   # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console project (for Gemini API)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mentoblo.git
   cd mentoblo
   ```

2. **Install dependencies**
   ```bash
   cd apps/web
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/complete-schema.sql`
   - Configure authentication providers (Google OAuth)

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **profiles** - User profiles and tutor information
- **tutor_availability** - Tutor scheduling preferences
- **bookings** - Session bookings and management
- **payments** - Payment processing and tracking
- **invoices** - Invoice generation and management
- **lesson_plans** - AI-generated lesson plans
- **feedback_reports** - Student progress reports
- **student_reports** - Simplified student feedback
- **shared_materials** - File management and sharing

All tables include Row Level Security (RLS) policies for secure data access.

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Role-based access control
- **Data Validation**: Server-side input validation
- **Secure Storage**: Encrypted file storage

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Automatic theme detection
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Real-time user feedback
- **Accessibility**: WCAG compliant components

## 📱 Mobile Support

The platform is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Mobile navigation
- Optimized file uploads
- Responsive data tables

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@mentoblo.com or join our Discord community.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with popular LMS platforms
- [ ] Advanced AI features
- [ ] White-label solutions

---

**Built with ❤️ for the tutoring community**
