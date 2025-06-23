# Troubleshooting Guide

## Quick Diagnosis

### 1. Check Server Status
```bash
# Server should be running on port 8080
curl http://localhost:8080
```

### 2. Check Browser Console
Open browser developer tools (F12) and look for:
- JavaScript errors (red text)
- Network errors
- React component errors

### 3. Test Basic Functionality
Visit these URLs to test different parts:
- `http://localhost:8080` - Main page
- `http://localhost:8080/auth` - Auth page
- `http://localhost:8080/settings` - Settings page

## Common Issues & Solutions

### Issue 1: Page Not Loading
**Symptoms**: White screen, 404 error, or connection refused

**Solutions**:
1. Check if server is running: `npm run dev`
2. Check port 8080 is available: `lsof -i :8080`
3. Try different browser or incognito mode
4. Clear browser cache

### Issue 2: React Components Not Rendering
**Symptoms**: Page loads but components are missing or broken

**Solutions**:
1. Check browser console for JavaScript errors
2. Look for import/export errors
3. Check if all dependencies are installed: `npm install`
4. Restart development server

### Issue 3: Chat Interface Not Working
**Symptoms**: Can't start chat or chat doesn't respond

**Solutions**:
1. Check if you can click "Start Building Your Stack"
2. Look for authentication errors
3. Check if AutonomousAgent component is loading
4. Verify environment variables are set

### Issue 4: Anthropic Features Not Visible
**Symptoms**: No badges, no test buttons, no raw response display

**Solutions**:
1. Check if API key is configured in `.env`
2. Look for "Fallback" badges (indicates API not configured)
3. Check browser console for API errors
4. Test API connectivity with "Test API" button

## Debug Steps

### Step 1: Basic Server Test
```bash
# Check if server responds
curl -I http://localhost:8080

# Check if port is in use
lsof -i :8080
```

### Step 2: Environment Check
```bash
# Check if .env file exists
ls -la .env

# Check environment variables (in React app)
console.log('API Key:', import.meta.env.VITE_ANTHROPIC_API_KEY);
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### Step 3: Component Test
Open browser console and run:
```javascript
// Test if React is working
console.log('React version:', React.version);

// Test if components are available
console.log('Components loaded:', typeof AutonomousAgent);

// Test environment variables
console.log('Environment:', {
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY ? 'Set' : 'Not set',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set'
});
```

### Step 4: API Test
```javascript
// Test Anthropic API directly
fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': 'your_api_key_here',
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-3-haiku-20240307',
    max_tokens: 100,
    messages: [{ role: 'user', content: 'Hello' }]
  })
})
.then(response => console.log('API Status:', response.status))
.catch(error => console.error('API Error:', error));
```

## Expected Behavior

### When Everything Works:
1. **Main Page**: Shows hero section with "Start Building Your Stack" button
2. **Chat Interface**: Shows AutonomousAgent component with test buttons
3. **API Features**: Blue "Powered by Anthropic" badges on responses
4. **Test Buttons**: "Test API", "Test", "My Stats" buttons visible
5. **Raw Response**: "Raw Anthropic Response" button for API responses

### When API Not Configured:
1. **Fallback Mode**: Yellow "Fallback" badges on responses
2. **No Raw Response**: No "Raw Anthropic Response" button
3. **Test API Button**: Shows configuration needed message
4. **Still Functional**: Basic responses work, just not from Anthropic

## Error Messages to Look For

### Console Errors:
- `Module not found` - Missing dependencies
- `Cannot read property of undefined` - Component not loaded
- `401 Unauthorized` - API key issue
- `Network Error` - Connection problem

### Network Tab:
- Failed requests to `/api/` endpoints
- CORS errors
- 404 errors for missing files

## Quick Fixes

### If Nothing Works:
1. **Restart everything**:
   ```bash
   # Stop server (Ctrl+C)
   # Clear cache
   rm -rf node_modules/.vite
   # Reinstall dependencies
   npm install
   # Restart server
   npm run dev
   ```

2. **Check file permissions**:
   ```bash
   ls -la src/components/chat/
   ```

3. **Verify imports**:
   ```bash
   # Check if all files exist
   find src -name "*.tsx" -exec echo {} \;
   ```

### If Components Don't Load:
1. Check browser console for import errors
2. Verify all component files exist
3. Check TypeScript compilation: `npx tsc --noEmit`

### If API Doesn't Work:
1. Verify API key in `.env` file
2. Check API key format (should start with `sk-`)
3. Test API key in Anthropic console
4. Check network connectivity

## Getting Help

If you're still having issues:

1. **Check the logs**: Look at terminal output and browser console
2. **Test step by step**: Use the debug.html file to isolate issues
3. **Verify environment**: Make sure all environment variables are set
4. **Check dependencies**: Ensure all packages are installed correctly

## Test Commands

Run these in browser console:
```javascript
// Comprehensive test
testAuth.runAllTests();

// Individual tests
testAuth.testSupabaseConfig();
testAuth.testAnthropicFeatures();
testAuth.testUIResponsiveness();
``` 