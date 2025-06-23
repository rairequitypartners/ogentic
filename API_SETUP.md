# Autonomous Agent API Setup

## Setting up the Anthropic API Key

The autonomous agent uses Anthropic's Claude API to provide conversational AI responses. Follow these steps to configure it:

### 1. Get an Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (it starts with `sk-ant-`)

### 2. Configure Environment Variables

Create a `.env` file in the root directory of your project:

```bash
# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
# Anthropic API Key for Autonomous Agent
VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here

# Optional: Supabase Configuration (if using database features)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Restart the Development Server

After creating the `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Test the Autonomous Agent

1. Open your browser to `http://localhost:8080`
2. Navigate to the chat interface
3. Type a message like "Hello" or "What AI tools should I use for content creation?"
4. The agent should respond with a conversational message

### 5. Verify API Integration

Check the browser console (F12) for logs:
- `Sending request to Anthropic API:` - Shows the request is being sent
- `Anthropic API response status: 200` - Shows successful response
- `Anthropic API response received:` - Shows the actual response data

### Troubleshooting

**If you see "API key not configured":**
- Make sure the `.env` file is in the root directory
- Verify the API key is correct and starts with `sk-ant-`
- Restart the development server after adding the `.env` file

**If you see API errors:**
- Check that your API key is valid and has sufficient credits
- Verify the API key has the correct permissions
- Check the browser console for detailed error messages

**Fallback Mode:**
- If the API is not configured, the agent will use fallback responses
- These are pre-written responses that still provide helpful information
- The agent will indicate when it's in fallback mode

### Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly
- Consider using environment variables in production deployments

### Cost Considerations

- Anthropic API has usage-based pricing
- Claude 3 Haiku is the most cost-effective model for this use case
- Monitor your usage in the Anthropic Console
- Consider setting up usage limits to control costs 