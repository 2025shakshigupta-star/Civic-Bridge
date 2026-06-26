# CivicBridge

A hyperlocal civic issue reporting platform for Indian cities — built with React, Tailwind CSS, and Framer Motion.

## Features

- **Animated Hero Screen** — CSS-animated road scene with cars, skyline, and flickering windows
- **Auth Flow** — Sign in / Sign up with form validation and password strength indicator
- **Live Map** — Custom SVG illustrated map with color-coded issue pins
- **Issue Cards** — Priority badges, complaint counts, upvote buttons
- **Issue Detail** — AI assessment, complaint meter, department info
- **Report Flow** — 3-step issue reporting with photo upload, severity selector, and animated success screen
- **AI Priority Engine** — Live priority ranking with collapsible formula + Gemini AI chat assistant
- **Profile** — Impact stats, citizen rank progression, recent activity
- **localStorage** — Persist upvotes and auth state
- **Mobile-first** — Max-width 420px, centered on desktop

## How to add your Gemini API key

1. Open `src/components/AIScreen.tsx`
2. Find the line:
   ```ts
   const GEMINI_API_KEY = '';
   ```
3. Paste your Gemini API key between the quotes:
   ```ts
   const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
   ```
4. Get a free key at: https://aistudio.google.com/app/apikey

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Google Gemini API
