"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRACTICE_BY_TOPIC, type TopicId } from "./data";

const VALID_TOPICS: TopicId[] = ["math", "history"];

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = (searchParams.get("topic") ?? "math") as TopicId;
  const key = VALID_TOPICS.includes(topic) ? topic : "math";
  const questions = PRACTICE_BY_TOPIC[key];

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const current = questions[step];
  const isLast = step === questions.length - 1;
  const correctOption = current.options.find((o) => o.correct);

  const handleSelect = (value: string) => {
    if (submitted) return;
    setSelected(value);
  };

  const handleNext = () => {
    if (submitted && isLast) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("practiceScore", String(score));
      }
      router.push("/done");
      return;
    }
    if (submitted) {
      setStep((s) => s + 1);
      setSelected(null);
      setSubmitted(false);
      return;
    }
    if (selected === null) return;
    setScore((s) => s + (selected === correctOption?.value ? 1 : 0));
    setSubmitted(true);
  };

  return (
    <>
      <Link
        href={`/lesson?topic=${key}`}
        className="text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors inline-block"
      >
        ← Lesson
      </Link>

      <p className="text-slate-500 text-sm font-medium mb-2">
        Practice {step + 1} of {questions.length}
      </p>
      <h1 className="font-display text-xl sm:text-2xl font-semibold text-white mb-6">
        {current.question}
      </h1>

      <ul className="space-y-3">
        {current.options.map((opt) => {
          const isChosen = selected === opt.value;
          const isCorrect = opt.correct;
          const showCorrect = submitted && isCorrect;
          const showWrong = submitted && isChosen && !isCorrect;
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => handleSelect(opt.value)}
                disabled={submitted}
                className={`w-full text-left rounded-xl border px-4 py-3.5 transition-all ${
                  showCorrect
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                    : showWrong
                      ? "border-red-500/50 bg-red-500/10 text-red-200"
                      : isChosen
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-slate-700 bg-slate-800/50 text-slate-200 hover:border-slate-600 hover:bg-slate-800"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="font-medium">{opt.label}</span>
                {showCorrect && (
                  <span className="ml-2 text-emerald-400 text-sm">✓ Correct</span>
                )}
                {showWrong && (
                  <span className="ml-2 text-red-400 text-sm">✗ Incorrect</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleNext}
          disabled={!submitted && selected === null}
          className="w-full sm:w-auto rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 transition-colors"
        >
          {!submitted ? "Check answer" : isLast ? "See results" : "Next question"}
        </button>
      </div>
    </>
  );
}

export default function PracticePage() {
  return (
    <main className="min-h-screen flex flex-col px-4 py-8 sm:px-6">
      <div className="max-w-xl mx-auto w-full">
        <Suspense fallback={<div className="text-slate-400 animate-pulse">Loading…</div>}>
          <PracticeContent />
        </Suspense>
      </div>
    </main>
  );
}
