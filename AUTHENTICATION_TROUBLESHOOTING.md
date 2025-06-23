# Authentication and UI Troubleshooting Guide

This guide helps you resolve authentication issues and UI problems in the ZingGPT application.

## Table of Contents

## Overview

This guide helps you resolve authentication issues and UI problems in the Ogentic application.

## Authentication Issues

### 1. Supabase Not Configured

**Symptoms:**
- "Authentication is not configured" error
- Sign in/up buttons are disabled
- "Demo Mode" indicator in header

**Solution:**
1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Restart the development server

### 2. Invalid Credentials Error

**Symptoms:**
- "Invalid login credentials" error
- 401 Unauthorized responses

**Solutions:**
- Verify your Supabase credentials are correct
- Check that your Supabase project is active
- Ensure you're using the anon key, not the service role key
- Clear browser cookies and try again

### 3. Network Connection Issues

**Symptoms:**
- "Network error" or timeout messages
- Authentication requests failing

**Solutions:**
- Check your internet connection
- Verify Supabase service status
- Try refreshing the page
- Check browser console for detailed error messages

### 4. Email Verification Issues

**Symptoms:**
- Account created but can't sign in
- "Email not confirmed" error

**Solutions:**
- Check your email for verification link
- Check spam folder
- Request new verification email from Supabase dashboard
- Ensure email confirmation is enabled in Supabase Auth settings

## UI Issues

### 1. Text Overflow

**Symptoms:**
- Text extending beyond container boundaries
- Horizontal scrollbars appearing

**Solutions:**
- Text now automatically wraps with `break-words` and `whitespace-pre-wrap`
- Long URLs break properly with `break-all`
- Container widths are responsive

### 2. Mobile Responsiveness

**Symptoms:**
- UI elements too small on mobile
- Text overlapping on small screens

**Solutions:**
- All components use responsive design
- Text sizes adjust for mobile screens
- Touch targets are appropriately sized

### 3. Loading States

**Symptoms:**
- No feedback during authentication
- Buttons not responding

**Solutions:**
- Loading states are implemented for all auth actions
- Buttons show "Please wait..." during processing
- Disabled states prevent multiple submissions

## Testing Authentication

### Browser Console Tests

Run these tests in your browser console to diagnose issues:

```javascript
// Run all tests
testAuth.runAllTests();

// Test specific areas
testAuth.testSupabaseConfig();
testAuth.testAuthState();
testAuth.testUIResponsiveness();
testAuth.testErrorHandling();
```

### Manual Testing Checklist

#### For Unauthenticated Users:
- [ ] Can access the main page
- [ ] Can start a new chat without signing in
- [ ] Sign in button is visible and functional
- [ ] Auth page loads properly
- [ ] Error messages are clear and helpful

#### For Authenticated Users:
- [ ] Can sign in successfully
- [ ] User avatar appears in header
- [ ] Can access user dropdown menu
- [ ] Can sign out successfully
- [ ] Session persists across page refreshes

#### For Demo Mode (No Supabase):
- [ ] "Demo Mode" indicator is visible
- [ ] Sign in button is disabled
- [ ] Can still use AI agent functionality
- [ ] Clear messaging about authentication status

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Authentication is not configured" | Missing Supabase credentials | Add credentials to .env file |
| "Invalid login credentials" | Wrong email/password | Check credentials or reset password |
| "Email not confirmed" | Email verification pending | Check email and click verification link |
| "Network error" | Connection issues | Check internet and Supabase status |
| "Something went wrong" | Unexpected error | Check browser console for details |

## Environment Variables

Required environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Anthropic API for AI features
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
```

## Debug Mode

Enable detailed logging by checking the browser console. All authentication events are logged with `[Auth]` prefix.

## Getting Help

If you're still experiencing issues:

1. Check the browser console for error messages
2. Run the test suite: `testAuth.runAllTests()`
3. Verify your Supabase project settings
4. Check the network tab for failed requests
5. Try in an incognito/private browser window

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Sign Up | ✅ Working | Requires Supabase |
| Sign In | ✅ Working | Requires Supabase |
| Sign Out | ✅ Working | Requires Supabase |
| Demo Mode | ✅ Working | No Supabase needed |
| AI Agent | ✅ Working | Requires Anthropic API |
| Text Overflow | ✅ Fixed | Responsive design |
| Mobile UI | ✅ Working | Touch-friendly |
| Error Handling | ✅ Improved | Clear messages | 