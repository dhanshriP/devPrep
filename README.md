# ⚡ DevPrep.ai

AI-powered interview prep and daily developer tips — free to run, built on Groq (Llama 3.3 70B).

## Features

- 🎯 **Interview Prep** — generate real interview questions by stack, role, and type. Click any question to load an AI answer on demand.
- 💡 **Daily Tip** — one focused, non-obvious insight per stack per day. Includes code snippet + TL;DR.
- 📦 Supports: Android, Kotlin, Jetpack Compose, Multi-Module, Gradle/DSL, Python, React, Node.js, Go, CI/CD, Kotlin Flow, Hilt

## Tech Stack

| Layer    | Tool                          |
|----------|-------------------------------|
| Frontend | React 18 + Vite               |
| Styling  | CSS Modules                   |
| LLM      | Groq (Llama 3.3 70B) — free  |
| Hosting  | Vercel (free tier)            |
| Proxy    | Vercel Serverless Function    |

---

## 🚀 Deploy to Vercel (5 minutes)

### 1. Get a free Groq API key
→ https://console.groq.com  
Sign up, go to **API Keys**, create one. It's free, no credit card.

### 2. Push this project to GitHub
```bash
git init
git add .
git commit -m "init devprep.ai"
gh repo create devprep-ai --public --push
```

### 3. Deploy on Vercel
1. Go to https://vercel.com → **Add New Project**
2. Import your GitHub repo
3. In **Environment Variables**, add:
   - Key: `GROQ_API_KEY`
   - Value: your key from step 1
4. Click **Deploy**

That's it. Vercel auto-detects Vite and the `/api` serverless function.

---

## 🛠 Local Development

```bash
npm install

# Create a local env file
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

npm run dev
```

> The Vite dev server proxies `/api` calls to `localhost:3000`.  
> For the serverless function locally, use `vercel dev` instead of `npm run dev`.

```bash
# Install Vercel CLI if needed
npm i -g vercel

vercel dev   # runs both frontend + serverless function locally
```

---

## Project Structure

```
devprep-ai/
├── api/
│   └── chat.js              ← Serverless function (Groq proxy, hides API key)
├── src/
│   ├── App.jsx              ← Root layout + tab routing
│   ├── api.js               ← callLLM() + safeParseJSON() utils
│   ├── constants.js         ← Stacks, roles, question types
│   ├── main.jsx             ← React entry point
│   ├── components/
│   │   ├── InterviewPrep.jsx / .module.css
│   │   ├── DailyTip.jsx     / .module.css
│   │   ├── QuestionCard.jsx / .module.css
│   │   └── StackSelector.jsx / .module.css
│   └── styles/
│       └── globals.css
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── .env.example
```

---

## Adding More Stacks

Edit `src/constants.js` and add to the `TECH_STACKS` array:

```js
{ id: 'rust', label: 'Rust', icon: '🦀', color: '#DEA584' },
```

---

## Rate Limits

Groq free tier: **30 requests/minute**, **14,400 requests/day**.  
For a small tool shared with a team, this is more than enough.  
If you scale beyond that, upgrade the Groq plan or add simple rate limiting in `api/chat.js`.

---

## License

MIT
