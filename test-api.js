// Simple test script to verify Anthropic API
// Run with: node test-api.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

async function testAnthropicAPI() {
  console.log('🧪 Testing Anthropic API...\n');
  
  const env = loadEnv();
  const apiKey = env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    console.error('❌ API key not found in .env file');
    console.log('Please add VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here to your .env file');
    return;
  }
  
  console.log('✅ API key found');
  console.log('🔑 Key starts with:', apiKey.substring(0, 10) + '...');
  console.log('📏 Key length:', apiKey.length);
  
  // Test both authentication methods
  const authMethods = [
    {
      name: 'Bearer Token',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      }
    },
    {
      name: 'x-api-key Header',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      }
    }
  ];
  
  for (const method of authMethods) {
    console.log(`\n📡 Testing ${method.name}...`);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: method.headers,
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          messages: [
            {
              role: 'user',
              content: 'Hello! Can you give me a brief response to test if the API is working?'
            }
          ],
          temperature: 0.7,
        }),
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ ${method.name} failed:`, errorText);
        continue;
      }
      
      const data = await response.json();
      console.log(`✅ ${method.name} successful!`);
      console.log('🤖 Response:', data.content[0].text);
      console.log('📈 Usage:', data.usage);
      
      // If we get here, this method worked
      console.log(`\n🎉 ${method.name} is working! Use this authentication method.`);
      return { success: true, method: method.name, data };
      
    } catch (error) {
      console.error(`❌ ${method.name} test failed:`, error.message);
    }
  }
  
  console.log('\n❌ Both authentication methods failed. Please check your API key.');
}

// Run the test
testAnthropicAPI(); 