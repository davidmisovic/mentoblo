# Mentoblo Deployment Guide

## 🚀 Production Deployment Checklist

### 1. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the complete SQL schema from `apps/web/supabase/complete-schema.sql`
3. Configure authentication providers:
   - Go to Authentication > Providers
   - Enable Google OAuth
   - Add your Google OAuth credentials
4. Set up storage bucket:
   - Go to Storage
   - Create bucket named "materials"
   - Set to public access

### 2. Google Cloud Console Setup
1. Create a new project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable the Generative AI API
3. Create an API key for Gemini
4. Add the API key to your environment variables

### 3. Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Configure webhooks (optional for MVP)
4. Add keys to environment variables

### 4. Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```
4. Deploy!

## 🔧 Environment Variables

### Required for Development
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Required for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📊 Database Schema

The complete database schema is available in `apps/web/supabase/complete-schema.sql`. This includes:

- **profiles** - User profiles and tutor information
- **tutor_availability** - Tutor scheduling preferences  
- **bookings** - Session bookings and management
- **payments** - Payment processing and tracking
- **invoices** - Invoice generation and management
- **lesson_plans** - AI-generated lesson plans
- **feedback_reports** - Student progress reports
- **student_reports** - Simplified student feedback
- **shared_materials** - File management and sharing

## 🔐 Security Configuration

### Supabase RLS Policies
All tables have Row Level Security (RLS) enabled with appropriate policies:
- Users can only access their own data
- Public access for tutor profiles and availability
- Secure file storage with proper access controls

### Authentication
- Google OAuth integration
- Role-based access control (tutor/student)
- Secure session management

## 🚀 Performance Optimizations

### Database
- Proper indexing on frequently queried columns
- Efficient queries with proper joins
- Connection pooling

### Frontend
- Server-side rendering for better SEO
- Optimized images and assets
- Lazy loading for components
- Efficient state management

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile navigation
- Optimized file uploads
- Progressive Web App features

## 🔍 Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics** - Performance monitoring
- **Supabase Dashboard** - Database monitoring
- **Stripe Dashboard** - Payment monitoring
- **Google Analytics** - User behavior tracking

## 🛠 Maintenance

### Regular Tasks
- Monitor database performance
- Update dependencies
- Review security policies
- Backup database
- Monitor error logs

### Scaling Considerations
- Database connection pooling
- CDN for static assets
- Caching strategies
- Load balancing (if needed)

## 🆘 Troubleshooting

### Common Issues
1. **Authentication errors** - Check Supabase configuration
2. **File upload failures** - Verify storage bucket permissions
3. **Payment processing** - Check Stripe webhook configuration
4. **AI generation failures** - Verify Gemini API key and quotas

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)

## 📈 Future Enhancements

- Mobile app development
- Advanced analytics
- Multi-language support
- White-label solutions
- Advanced AI features
- Integration with popular LMS platforms
