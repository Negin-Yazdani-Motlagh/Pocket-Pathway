"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SCORES_KEY = "pocket_pathway_scores";
const METHOD_KEY = "pocket_pathway_method";
const METHOD_NEXT_REVIEW_KEY = "pocket_pathway_next_review";

type ScoreEntry = { score: number; total: number };

function getStoredScores(): Record<string, ScoreEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ScoreEntry>;
  } catch {
    return {};
  }
}

function saveScoreForDate(dateKey: string, score: number, total: number) {
  const scores = getStoredScores();
  scores[dateKey] = { score, total };
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

function assignSecretMethod(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(METHOD_KEY) != null) return;
  const method = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(METHOD_KEY, method);
  if (method === "B") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    localStorage.setItem(METHOD_NEXT_REVIEW_KEY, tomorrow.toISOString().slice(0, 10));
  }
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekday = first.getDay();
  const daysInMonth = last.getDate();
  const result: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) result.push(null);
  for (let d = 1; d <= daysInMonth; d++) result.push(d);
  return result;
}

function dateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DonePage() {
  const [score, setScore] = useState<number | null>(null);
  const [total, setTotal] = useState(2);
  const [scores, setScores] = useState<Record<string, ScoreEntry>>({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("practiceScore");
    const num = raw !== null ? parseInt(raw, 10) : 0;
    const s = Number.isNaN(num) ? 0 : num;
    setScore(s);
    setTotal(2);

    const today = new Date();
    const dateKeyToday = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
    saveScoreForDate(dateKeyToday, s, 2);
    assignSecretMethod();
    setScores(getStoredScores());
  }, []);

  const days = getCalendarDays(year, month);
  const monthName = MONTHS[month];

  return (
    <main className="min-h-screen flex flex-col px-4 py-8 sm:px-6">
      <div className="max-w-md mx-auto w-full">
        <Link
          href="/"
          className="text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors inline-block"
        >
          ← Home
        </Link>

        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Your progress
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Green check = you practiced. Score is shown under the day.
        </p>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4 sm:p-5 mb-8">
          <p className="text-slate-500 text-sm font-medium mb-3">{monthName} {year}</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-slate-500 text-xs font-medium py-1">
                {w}
              </div>
            ))}
            {days.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const key = dateKey(year, month, day);
              const entry = scores[key];
              const hasScore = entry != null;
              const isToday =
                year === new Date().getFullYear() &&
                month === new Date().getMonth() &&
                day === new Date().getDate();
              return (
                <div
                  key={key}
                  className={`min-h-[3rem] rounded-lg flex flex-col items-center justify-center ${
                    isToday ? "ring-1 ring-blue-500/50 bg-blue-500/5" : ""
                  } ${hasScore ? "bg-emerald-500/10" : ""}`}
                >
                  <span className={`text-sm ${isToday ? "text-blue-400 font-semibold" : "text-slate-300"}`}>
                    {day}
                  </span>
                  {hasScore && (
                    <>
                      <span className="text-emerald-400 text-lg leading-none" aria-hidden>✓</span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        {entry.score}/{entry.total}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {score !== null && (
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 px-6 py-4 mb-8">
            <p className="text-slate-500 text-sm font-medium">Today’s score</p>
            <p className="text-2xl font-display font-bold text-blue-400 mt-1">
              {score} / {total}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 transition-colors w-full sm:w-auto"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
