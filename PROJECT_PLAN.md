# Pocket Pathway – Project Plan

## Big picture (summary)

- **Home** → START button  
- **Quiz** → 6–10 multiple-choice questions (learning preferences)  
- **Strategy** → Use ChatGPT API to assign one predefined learning strategy from answers  
- **Lesson** → Short math lesson tailored to that strategy  
- **Practice** → 2 practice questions  
- **Final** → “Come back tomorrow for review” + save score  
- **Hosting** → Free only (no paid domain or host)

---

## Smaller tasks (in order)

### Phase 1: Setup & static site

| # | Task | What to do |
|---|------|------------|
| 1 | **Choose stack** | Use **HTML + CSS + JS** (no framework) or **React/Vite** if you prefer. For “very simple,” plain HTML/CSS/JS is enough. |
| 2 | **Create repo** | Initialize git, create a repo on GitHub (e.g. `Pocket-Pathway`). |
| 3 | **Home page** | Single page: title, short intro, one **START** button that goes to the quiz. |
| 4 | **Routing** | Either: (a) one HTML file and show/hide sections with JS, or (b) separate files: `index.html`, `quiz.html`, `lesson.html`, `practice.html`, `done.html`. Simple option: **single page + JS to switch “screens.”** |

### Phase 2: Learning preference quiz

| # | Task | What to do |
|---|------|------------|
| 5 | **Define 6–10 questions** | Write questions and 3–4 options each (e.g. “I learn best by: A) reading, B) videos, C) doing exercises, D) diagrams”). |
| 6 | **Quiz UI** | One question at a time, Next/Previous if you want, store selected option per question in JS (e.g. `answers = { q1: 'A', q2: 'B', ... }`). |
| 7 | **Submit answers** | On “Finish quiz,” send `answers` to your backend or directly to ChatGPT (see Phase 3). |

### Phase 3: Learning strategy (ChatGPT API)

| # | Task | What to do |
|---|------|------------|
| 8 | **Backend for API key** | **Do not put the OpenAI API key in the frontend.** Use a tiny backend: e.g. **Vercel/Netlify serverless function** or **GitHub Actions + a free serverless** that receives answers and calls OpenAI. |
| 9 | **Predefine strategies** | List 3–5 strategies (e.g. “Visual”, “Reading”, “Practice-heavy”, “Story-based”). Write a **system prompt** that says: “Given these answers, pick one of these strategies: [list]. Reply with only the strategy name.” |
| 10 | **Call ChatGPT** | Send user answers in one message; parse response to get one strategy name; return it to the frontend. Frontend stores it (e.g. `localStorage` or state) for the next step. |

### Phase 4: Math lesson + practice

| # | Task | What to do |
|---|------|------------|
| 11 | **Lesson content** | Pre-write **one short math lesson** per strategy (same topic, different style). Example: “Fractions – introduction” in 3 versions: visual (with diagrams), text-heavy, example-heavy. |
| 12 | **Show lesson** | After strategy is chosen, show the matching lesson (simple HTML section or a small JSON of lesson text per strategy). |
| 13 | **2 practice questions** | Add 2 fixed multiple-choice math questions. On submit, compute score (e.g. 0, 1, 2) and show it. |
| 14 | **Final page** | Screen with “Come back tomorrow for review” and display the score. |

### Phase 5: Save score (no backend DB)

| # | Task | What to do |
|---|------|------------|
| 15 | **Save score in browser** | Use **localStorage**: e.g. `localStorage.setItem('lastScore', score)` and `localStorage.setItem('lastDate', new Date().toDateString())`. No server or DB needed. |
| 16 | **(Optional) Save via backend** | If you add a serverless function for ChatGPT, you can also append a line to a **free DB** (e.g. **Supabase** or **Firebase** free tier) to store score + date. Only do this if you want to track users later. |

### Phase 6: Deploy for free (no domain cost)

| # | Task | What to do |
|---|------|------------|
| 17 | **Deploy frontend** | Push code to GitHub, then connect repo to **GitHub Pages** or **Vercel** or **Netlify**. You get a free URL: `https://yourusername.github.io/Pocket-Pathway` or `https://pocket-pathway.vercel.app`. |
| 18 | **Backend (API key)** | Deploy the small serverless function (from task 8) on the **same** Vercel/Netlify project so the frontend calls `https://yoursite.vercel.app/api/strategy` (no extra domain). |
| 19 | **No custom domain** | Use the default subdomain (e.g. `.github.io`, `.vercel.app`, `.netlify.app`) so you pay **$0** for domain and hosting. |

---

## Free hosting & domain – concrete options

| Option | Frontend | Backend (API) | Domain |
|--------|----------|----------------|--------|
| **GitHub Pages** | ✅ Free static hosting | ❌ No serverless; you’d need a separate service for the API | `username.github.io/repo-name` |
| **Vercel** | ✅ Free | ✅ Free serverless functions (Node/API route) | `project-name.vercel.app` |
| **Netlify** | ✅ Free | ✅ Free serverless functions | `project-name.netlify.app` |
| **Cloudflare Pages** | ✅ Free | ✅ Workers (free tier) for API | `project.pages.dev` |

**Recommendation:** Use **Vercel** or **Netlify** so both your static site and the ChatGPT proxy (serverless function) live in one place, one free URL, no custom domain.

---

## Suggested order of implementation

1. Build **home + quiz (screens 1–2)** in one HTML file + JS.  
2. Add **strategy assignment**: first mock it (random strategy), then add **one serverless function** that calls ChatGPT and replace the mock.  
3. Add **lesson screen** (content per strategy).  
4. Add **practice questions + final screen** and **localStorage** for score.  
5. Deploy to **Vercel** or **Netlify** and test the full flow.

---

## Tech checklist (free only)

- **Code:** GitHub (free).  
- **Hosting:** Vercel or Netlify (free).  
- **Domain:** Use default `*.vercel.app` or `*.netlify.app` (free).  
- **API key:** Stored only in serverless function env (e.g. Vercel/Netlify env vars), not in frontend.  
- **Optional DB:** Supabase or Firebase free tier only if you want to store scores on a server later.

If you tell me your preferred stack (plain HTML/JS vs React), I can outline the exact file structure and a minimal code skeleton next.
