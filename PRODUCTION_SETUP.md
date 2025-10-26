# Production Setup Guide for Mentoblo

## 1. Supabase Configuration

### Authentication > URL Configuration
- **Site URL:** `https://yourdomain.com` (replace with your actual domain)
- **Redirect URLs:** Add both:
  - `http://localhost:3000/api/auth/callback` (for development)
  - `https://yourdomain.com/api/auth/callback` (for production)

### Authentication > Providers > Google
- **Authorized redirect URIs:** Add both:
  - `http://localhost:3000/api/auth/callback` (for development)
  - `https://yourdomain.com/api/auth/callback` (for production)

## 2. Google Cloud Console Setup

### OAuth 2.0 Client IDs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Create or edit your OAuth 2.0 Client ID
4. **Authorized JavaScript origins:** Add:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. **Authorized redirect URIs:** Add:
   - `https://qnokhlujbcizmarngbhv.supabase.co/auth/v1/callback` (Supabase callback)

## 3. Environment Variables

### Development (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qnokhlujbcizmarngbhv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel/Netlify/etc.)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qnokhlujbcizmarngbhv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key

# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 4. Deployment Platforms

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure all environment variables are set
- Make sure the build process includes all necessary files
- Configure custom domain if needed

## 5. Domain Configuration

### Custom Domain Setup
1. **DNS Configuration:**
   - Point your domain to your hosting provider
   - Add CNAME record if using subdomain

2. **SSL Certificate:**
   - Most hosting platforms provide automatic SSL
   - Ensure HTTPS is enabled

3. **Update Supabase Settings:**
   - Update Site URL to your production domain
   - Add production redirect URL

## 6. Testing Production Setup

### Pre-deployment Checklist
- [ ] Supabase redirect URLs configured
- [ ] Google OAuth redirect URIs configured
- [ ] Environment variables set
- [ ] Domain DNS configured
- [ ] SSL certificate active

### Post-deployment Testing
1. Test Google sign-in on production
2. Verify redirects work correctly
3. Test all authentication flows
4. Check console for any errors

## 7. Common Issues and Solutions

### Issue: Google sign-in redirects to Supabase domain
**Solution:** Update Supabase Site URL and Redirect URLs in dashboard

### Issue: OAuth error after sign-in
**Solution:** Check Google Cloud Console redirect URIs match Supabase settings

### Issue: Environment variables not loading
**Solution:** Ensure variables are set in hosting platform dashboard

### Issue: CORS errors
**Solution:** Verify all domains are added to authorized origins

## 8. Security Considerations

### Production Security
- Use strong, unique API keys
- Enable HTTPS only
- Regularly rotate API keys
- Monitor authentication logs
- Set up proper CORS policies

### Environment Variables
- Never commit sensitive keys to version control
- Use environment-specific configurations
- Regularly audit access permissions

## 9. Monitoring and Maintenance

### Monitoring
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor authentication success rates
- Track user sign-up/sign-in metrics

### Maintenance
- Regular security updates
- Monitor API usage and limits
- Backup user data regularly
- Update dependencies regularly

## 10. Support and Troubleshooting

### Debug Steps
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test authentication flow step by step
4. Check Supabase logs for errors
5. Verify Google OAuth configuration

### Getting Help
- Check Supabase documentation
- Review Google OAuth documentation
- Check hosting platform documentation
- Contact support if needed
