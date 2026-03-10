# ProposalAI — Proposal Generator

AI-powered proposal generator for service-based SMBs. Built with React + Vite, deployed on Vercel.

## Deploy in 5 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
gh repo create proposal-generator --public --push
```
(or push manually via GitHub Desktop)

### 3. Import to Vercel
Go to https://vercel.com/new → Import your GitHub repo → Vercel auto-detects Vite.

### 4. Add your API key
In Vercel dashboard → Project → Settings → Environment Variables:
```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-...
```

### 5. Deploy
```bash
vercel --prod
```
Or just push to `main` — Vercel auto-deploys on every push.

---

## Local development
```bash
npm run dev
```
For local dev, create a `.env.local` file (never commit this):
```
ANTHROPIC_API_KEY=sk-ant-...
```

## How the API key is protected
- The frontend calls `/api/generate` — a Vercel serverless function
- The serverless function holds the API key in `process.env.ANTHROPIC_API_KEY`
- The key is **never sent to the browser** or included in the JS bundle
- `.env` and `.env.local` are in `.gitignore`
