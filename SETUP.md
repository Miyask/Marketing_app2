# Local Development Setup

## Prerequisites
- Node.js 18+ installed
- A Firebase project (for authentication and database)
- AI API keys (Google, OpenAI, or OpenRouter)

## Setup Steps

### 1. Clone and Install
```bash
cd project
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your keys from:
- **Google AI Studio**: https://aistudio.google.com/
- **OpenAI Dashboard**: https://platform.openai.com/api-keys
- **OpenRouter**: https://openrouter.ai/keys

### 3. Firebase Configuration
Make sure your Firebase configuration is set in environment variables or `src/firebase/config.ts`.

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at http://localhost:9002

### 5. Test AI Connection
1. Sign in (use anonymous sign-in for testing)
2. Click "Motor IA" button in header
3. Select your AI provider and enter API key
4. Click "Test Connection" to verify
5. Click "Save Configuration"

### 6. Try AI Features
- **Strategy Generator**: Create full marketing plans
- **Asset Generator**: Generate slogans and brand assets
- **Market Discovery**: Find potential clients in a sector
- **Profile Extractor**: Analyze any business website

## Troubleshooting

### "API Key missing" error
- Ensure you've saved the configuration in AI Settings
- Check that you entered the key for the correct provider

### Firebase connection issues
- Verify your Firebase config in `.env` or `src/firebase/config.ts`
- Make sure Firestore is enabled in Firebase Console

### AI requests fail
- Check browser console for detailed error messages
- Verify your API key is valid and has available credits
- Some models may not be available in your region

## Development Tips

- Use **Gemini Flash** for fastest responses and best value
- **Test Connection** button validates your API key before using features
- Settings are saved per user in Firestore
- All AI calls happen server-side via Next.js server actions
