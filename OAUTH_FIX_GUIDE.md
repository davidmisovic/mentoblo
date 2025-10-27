# OAuth State Error Fix Guide

## The Problem
The error `bad_oauth_state` occurs when there's a mismatch between:
1. The redirect URL configured in Supabase
2. The redirect URL we're using in the code

## Current Configuration
- **Code redirect URL**: `${window.location.origin}/` (e.g., `http://localhost:3002/`)
- **Supabase redirect URL**: Needs to match exactly

## Steps to Fix

### 1. Check Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > URL Configuration
3. Check the "Site URL" and "Redirect URLs"

### 2. Update Supabase Configuration
Add these URLs to your Supabase redirect URLs:
- `http://localhost:3000/`
- `http://localhost:3001/`
- `http://localhost:3002/`
- `https://www.mentoblo.com/`
- `https://mentoblo.com/`

### 3. Verify Site URL
Set the Site URL to: `https://www.mentoblo.com`

### 4. Test the Fix
1. Try Google sign-in from localhost
2. Check console logs for OAuth flow
3. Verify redirect works properly

## Alternative Fix (If above doesn't work)
If the state error persists, we may need to:
1. Clear browser cookies/cache
2. Use a different OAuth flow (PKCE)
3. Check Google Cloud Console configuration

## Debug Information
The enhanced logging will show:
- OAuth callback hash
- Search parameters
- Token extraction
- Session setting
- Any errors encountered

