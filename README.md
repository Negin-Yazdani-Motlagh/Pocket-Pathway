# Pocket Pathway

A simple educational site: pick a topic (Math or History) → short lesson → 2 practice questions → score saved on a calendar.

**Live site (GitHub Pages):** https://Negin-Yazdani-Motlagh.github.io/Pocket-Pathway/

## Flow

1. **Home** — START button  
2. **Topics** — Choose **Math** or **History**  
3. **Lesson** — Short text/visual lesson for that topic  
4. **Practice** — 2 easy questions; score out of 2  
5. **Done** — Calendar view of the current month: green check ✓ and score under each day you practiced.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (GitHub Pages)

The site is built and deployed automatically when you push to `main` via GitHub Actions. Enable GitHub Pages in the repo:

**Settings** → **Pages** → **Build and deployment** → **Source**: **GitHub Actions**.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS**
- Scores stored in **localStorage**
