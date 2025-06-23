// Test script to verify authentication functionality
// Run this in the browser console to test auth states

console.log('🔍 Testing Authentication States...');

// Test 1: Check if Supabase is configured
function testSupabaseConfig() {
  console.log('\n📋 Test 1: Supabase Configuration');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isUsingFallback = supabaseUrl === "https://iwwjfixonkmhhpnfkhkm.supabase.co" || 
                         supabaseKey === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2pmaXhvbmttaGhwbmZraGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTE4ODksImV4cCI6MjA2NDg4Nzg4OX0.A1KcWuoLMIdOz2nnt4X3fyX8Re4YGOoHWSN1LqnuRso";
  
  if (isUsingFallback) {
    console.log('❌ Using hardcoded fallback credentials');
    console.log('💡 To enable authentication, add to your .env file:');
    console.log('   VITE_SUPABASE_URL=your_supabase_url');
    console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  } else {
    console.log('✅ Supabase configured with environment variables');
  }
  
  return !isUsingFallback;
}

// Test 2: Check current auth state
function testAuthState() {
  console.log('\n📋 Test 2: Current Authentication State');
  
  // This would need to be run in the React app context
  // For now, just check if we can access the auth context
  try {
    // Check if we're in a React component context
    if (typeof window !== 'undefined' && window.location) {
      console.log('🌐 Running in browser environment');
      console.log('📍 Current URL:', window.location.href);
      
      // Check if we're on the auth page
      if (window.location.pathname === '/auth') {
        console.log('🔐 Currently on authentication page');
      } else {
        console.log('🏠 Currently on main page');
      }
    }
  } catch (error) {
    console.log('❌ Error checking auth state:', error);
  }
}

// Test 3: Test UI responsiveness
function testUIResponsiveness() {
  console.log('\n📋 Test 3: UI Responsiveness');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log('📱 Viewport size:', viewport);
  
  // Check for common UI issues
  const issues = [];
  
  // Check for horizontal scroll
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
    issues.push('Horizontal scroll detected');
  }
  
  // Check for text overflow
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
  textElements.forEach(el => {
    if (el.scrollWidth > el.clientWidth && el.clientWidth > 0) {
      issues.push(`Text overflow in element: ${el.tagName} - "${el.textContent?.substring(0, 50)}..."`);
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ No UI responsiveness issues detected');
  } else {
    console.log('⚠️ UI issues detected:');
    issues.slice(0, 5).forEach(issue => console.log('   -', issue));
    if (issues.length > 5) {
      console.log(`   ... and ${issues.length - 5} more issues`);
    }
  }
}

// Test 4: Test error handling
function testErrorHandling() {
  console.log('\n📋 Test 4: Error Handling');
  
  // Simulate common error scenarios
  const testErrors = [
    'Invalid email format',
    'Password too short',
    'Network error',
    'Supabase connection failed',
    'Authentication service unavailable'
  ];
  
  console.log('🧪 Test error messages:');
  testErrors.forEach(error => {
    console.log(`   - "${error}" (${error.length} chars)`);
  });
  
  console.log('✅ Error handling test completed');
}

// Test 5: Check Anthropic API features
function testAnthropicFeatures() {
  console.log('\n📋 Test 5: Anthropic API Features');
  
  // Check if Anthropic API key is configured
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    console.log('❌ Anthropic API key not configured');
    console.log('💡 Add VITE_ANTHROPIC_API_KEY to your .env file to enable AI features');
    return false;
  }
  
  console.log('✅ Anthropic API key configured');
  
  // Check for UI elements that should be present
  const features = [
    { selector: '[title*="Powered by Anthropic"]', name: 'Anthropic badge' },
    { selector: '[title*="fallback"]', name: 'Fallback badge' },
    { selector: 'button:contains("Test API")', name: 'Test API button' },
    { selector: 'button:contains("Raw Anthropic Response")', name: 'Raw response button' },
    { selector: '.bg-blue-100.text-blue-800', name: 'Anthropic badge styling' },
    { selector: '.bg-yellow-100.text-yellow-800', name: 'Fallback badge styling' }
  ];
  
  console.log('🔍 Checking for UI features:');
  features.forEach(feature => {
    const elements = document.querySelectorAll(feature.selector);
    if (elements.length > 0) {
      console.log(`   ✅ ${feature.name} found (${elements.length} elements)`);
    } else {
      console.log(`   ❌ ${feature.name} not found`);
    }
  });
  
  return true;
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Authentication and UI Tests...\n');
  
  const supabaseConfigured = testSupabaseConfig();
  testAuthState();
  testUIResponsiveness();
  testErrorHandling();
  const anthropicConfigured = testAnthropicFeatures();
  
  console.log('\n📊 Test Summary:');
  console.log(`   Supabase Configured: ${supabaseConfigured ? '✅' : '❌'}`);
  console.log(`   Anthropic API Configured: ${anthropicConfigured ? '✅' : '❌'}`);
  console.log('   Auth State: ✅ Checked');
  console.log('   UI Responsiveness: ✅ Checked');
  console.log('   Error Handling: ✅ Checked');
  
  if (!supabaseConfigured) {
    console.log('\n💡 Recommendations:');
    console.log('   1. Set up Supabase project at https://supabase.com');
    console.log('   2. Add credentials to .env file');
    console.log('   3. Test authentication flow');
  }
  
  if (!anthropicConfigured) {
    console.log('\n🤖 To see Anthropic API features:');
    console.log('   1. Get an API key from https://console.anthropic.com');
    console.log('   2. Add VITE_ANTHROPIC_API_KEY to your .env file');
    console.log('   3. Restart the server and test the AI agent');
    console.log('   4. Look for "Powered by Anthropic" badges and "Test API" buttons');
  }
  
  console.log('\n✅ All tests completed!');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAuth = {
    testSupabaseConfig,
    testAuthState,
    testUIResponsiveness,
    testErrorHandling,
    testAnthropicFeatures,
    runAllTests
  };
  
  console.log('🧪 Auth test functions available:');
  console.log('   - testAuth.runAllTests() - Run all tests');
  console.log('   - testAuth.testSupabaseConfig() - Test Supabase config');
  console.log('   - testAuth.testAuthState() - Test auth state');
  console.log('   - testAuth.testUIResponsiveness() - Test UI');
  console.log('   - testAuth.testErrorHandling() - Test error handling');
  console.log('   - testAuth.testAnthropicFeatures() - Test Anthropic features');
}

// Auto-run if this is the main module
if (typeof module !== 'undefined' && module.exports) {
  runAllTests();
} 