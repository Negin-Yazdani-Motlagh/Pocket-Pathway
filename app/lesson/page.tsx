"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LESSONS, type TopicId } from "./data";

const VALID_TOPICS: TopicId[] = ["math", "history"];

/** Pizza visual: 4 equal slices, 1 highlighted — matches the “1 out of 4” lesson */
function FractionPizzaVisual() {
  const cx = 60;
  const cy = 60;
  const cheeseR = 44; // radius of cheese (inner part)
  const crustR = 52;  // radius of whole pizza (crust shows as ring)
  return (
    <svg
      viewBox="0 0 120 120"
      className="w-full max-w-[260px] h-auto mx-auto block"
      aria-hidden
    >
      {/* Whole pizza base (crust) */}
      <circle cx={cx} cy={cy} r={crustR} fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
      {/* 4 slices (cheese) — top-right slice is “1 out of 4” (lighter yellow) */}
      <path
        d={`M${cx} ${cy} L${cx} ${cy - cheeseR} L${cx + cheeseR} ${cy} Z`}
        fill="#fcd34d"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      <path
        d={`M${cx} ${cy} L${cx + cheeseR} ${cy} L${cx} ${cy + cheeseR} Z`}
        fill="#f59e0b"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      <path
        d={`M${cx} ${cy} L${cx} ${cy + cheeseR} L${cx - cheeseR} ${cy} Z`}
        fill="#f59e0b"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      <path
        d={`M${cx} ${cy} L${cx - cheeseR} ${cy} L${cx} ${cy - cheeseR} Z`}
        fill="#f59e0b"
        stroke="#d97706"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LessonContent() {
  const searchParams = useSearchParams();
  const topic = (searchParams.get("topic") ?? "math") as TopicId;
  const key = VALID_TOPICS.includes(topic) ? topic : "math";
  const lesson = LESSONS[key];
  const [imageFailed, setImageFailed] = useState(false);

  const showPizzaVisual = key === "math" && (lesson.image === undefined || imageFailed);

  return (
    <>
      <Link
        href="/topics"
        className="text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors inline-block"
      >
        ← Topics
      </Link>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 sm:p-8 animate-slide-up">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">
          {lesson.type === "visual" ? "Visual" : "Text"} lesson
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
          {lesson.title}
        </h1>
        <p className="text-slate-300 mb-6 leading-relaxed">{lesson.intro}</p>
        {showPizzaVisual && (
          <div className="mb-6 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/50 py-6 flex items-center justify-center">
            <FractionPizzaVisual />
          </div>
        )}
        {lesson.image && !imageFailed && (
          <div className="mb-6 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/50 min-h-[200px] flex items-center justify-center">
            <img
              src={lesson.image}
              alt="Pizza cut into 4 equal slices — 1 slice is 1 out of 4, or 1/4"
              className="w-full h-auto object-contain max-h-80"
              onError={() => setImageFailed(true)}
            />
          </div>
        )}
        <div className="space-y-4">
          {lesson.body.map((para, i) => (
            <p key={i} className="text-slate-200 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href={`/practice?topic=${key}`}
          className="inline-flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 transition-colors"
        >
          Continue to practice →
        </Link>
      </div>
    </>
  );
}

export default function LessonPage() {
  return (
    <main className="min-h-screen flex flex-col px-4 py-8 sm:px-6">
      <div className="max-w-xl mx-auto w-full">
        <Suspense fallback={<div className="text-slate-400 animate-pulse">Loading…</div>}>
          <LessonContent />
        </Suspense>
      </div>
    </main>
  );
}
