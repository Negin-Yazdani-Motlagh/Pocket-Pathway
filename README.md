# Pocket Pathway

A simple educational site: pick a topic (Math or History) → short lesson → 2 practice questions → score saved on a calendar.

## Flow

1. **Home** — START button  
2. **Topics** — Choose **Math** or **History**  
3. **Lesson** — Short text/visual lesson for that topic  
4. **Practice** — 2 easy questions; score out of 2  
5. **Done** — Calendar view of the current month: green check ✓ and score under each day you practiced. Today’s score is saved here.

The system secretly assigns **Method A** (lesson only, no review) or **Method B** (spaced repetition: same idea again tomorrow). The student does not see this; it’s stored only in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (free)

Push to **GitHub**, then connect the repo to **Vercel** or **Netlify**. Use the default URL (e.g. `your-project.vercel.app`).

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS**
- Scores and secret method stored in **localStorage** (no backend required)
