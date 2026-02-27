"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DRILL_PROMPT, PYTHON_SNIPPET } from "./data";

const NAME_KEY = "pocket_pathway_user_name";

type EvaluationResult = {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
};

type StepId = 0 | 1 | 2 | 3;

type RunResult =
  | { status: "ok"; output: number; steps: number }
  | { status: "stuck"; steps: number }
  | { status: "wrong"; output: number; steps: number };

const CORRECT_WHY_STUCK =
  "i starts at 0 and never changes, so the loop runs forever and the program never finishes.";
const CORRECT_BUG_PART =
  "The while condition 'while i <= n:' combined with never changing i.";
const CORRECT_FIX = "Add 'i += 1' inside the loop so i increases each time.";

function optionStyles(args: {
  showAnswers: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  locked: boolean;
}) {
  const base =
    "flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors";
  const interactive = args.locked ? "" : " hover:bg-slate-900/60 cursor-pointer";

  if (!args.showAnswers) {
    return `${base} border-slate-800 bg-slate-950/50${interactive}`;
  }

  if (args.isCorrect) {
    return `${base} border-emerald-500/70 bg-emerald-500/10`;
  }

  if (args.isSelected && !args.isCorrect) {
    return `${base} border-rose-500/70 bg-rose-500/10`;
  }

  return `${base} border-slate-800 bg-slate-950/30`;
}

function simulateSumToN(
  n: number,
  variant: "original" | "increment" | "return_in_loop" | "while_ge",
): RunResult {
  let total = 0;
  let i = 0;
  let steps = 0;
  const stepLimit = 50_000;

  const condition = () => (variant === "while_ge" ? i >= n : i <= n);

  while (condition()) {
    steps += 1;
    if (steps > stepLimit) return { status: "stuck", steps };

    total += i;

    if (variant === "return_in_loop") {
      return { status: total === 15 ? "ok" : "wrong", output: total, steps };
    }

    if (variant === "increment") {
      i += 1;
    } else {
      // original bug: i never changes
    }
  }

  return { status: total === 15 ? "ok" : "wrong", output: total, steps };
}

export default function DrillPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [step, setStep] = useState<StepId>(0);
  const [whyStuck, setWhyStuck] = useState<string>("");
  const [bugPart, setBugPart] = useState<string>("");
  const [fixChoice, setFixChoice] = useState<string>("");
  const [runVariant, setRunVariant] = useState<
    "original" | "increment" | "return_in_loop" | "while_ge"
  >("original");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(NAME_KEY);
      setUserName(saved?.trim() || "");
    }
  }, []);

  const combinedReasoning = [
    "Goal: This function should print the sum 0+1+2+...+n (for n=5 that sum is 15).",
    `Why it gets stuck: ${whyStuck}`,
    `Buggy part: ${bugPart}`,
    `Fix: ${fixChoice}`,
  ].join("\n");

  const score = result ? Math.max(0, Math.min(100, result.score)) : null;
  const stage =
    score == null || score < 40
      ? { label: "Seed – starting out", emoji: "🌱" }
      : score < 70
        ? { label: "Sprout – getting clearer", emoji: "🌿" }
        : score < 90
          ? { label: "Tree – strong reasoning", emoji: "🌳" }
          : { label: "Flowering tree – excellent", emoji: "🌸" };

  const canNext =
    step === 0 ||
    (step === 1 && whyStuck) ||
    (step === 2 && bugPart) ||
    (step === 3 && fixChoice);

  const handleNext = () => {
    // Always allow advancing from step 0 (no choice required)
    if (step < 3) {
      if (step === 0) {
        setStep(1);
        return;
      }
      if (step === 1 && !whyStuck) return;
      if (step === 2 && !bugPart) return;
      setStep((s) => (s + 1) as StepId);
      return;
    }

    if (!canNext) return;

    // Final step: compute feedback locally (no API call)
    const correctCount =
      (whyStuck === CORRECT_WHY_STUCK ? 1 : 0) +
      (bugPart === CORRECT_BUG_PART ? 1 : 0) +
      (fixChoice === CORRECT_FIX ? 1 : 0);

    let mcScore: number;
    switch (correctCount) {
      case 3:
        mcScore = 95;
        break;
      case 2:
        mcScore = 75;
        break;
      case 1:
        mcScore = 55;
        break;
      default:
        mcScore = 35;
    }

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (correctCount >= 2) {
      strengths.push(
        "You traced the loop and its variables in a structured way.",
      );
    } else {
      improvements.push(
        "Walk through each loop step explicitly to see how i and total change.",
      );
    }

    if (whyStuck === CORRECT_WHY_STUCK) {
      strengths.push("You correctly identified that i never changes.");
    } else {
      improvements.push(
        "Focus on whether the loop variable ever changes so the loop can end.",
      );
    }

    if (bugPart === CORRECT_BUG_PART) {
      strengths.push(
        "You pinpointed the combination of the while condition and the missing increment.",
      );
    } else {
      improvements.push(
        "Connect the condition while i <= n with the fact that i is never incremented.",
      );
    }

    if (fixChoice === CORRECT_FIX) {
      strengths.push("You proposed the right minimal fix: add i += 1.");
    } else {
      improvements.push(
        "Try to propose the smallest change that makes the loop eventually stop.",
      );
    }

    const summary =
      "This score comes from how well you described the goal, followed the loop step by step, located the infinite loop bug, and chose a fix.";

    const evaluation: EvaluationResult = {
      score: mcScore,
      strengths,
      improvements,
      summary,
    };

    setResult(evaluation);
    setRunVariant("original");
    setRunResult(null);

    if (typeof window !== "undefined") {
      const today = new Date();
      const key = today.toISOString().slice(0, 10);
      const raw = window.localStorage.getItem("ct_drill_history") ?? "{}";
      const history = JSON.parse(raw) as Record<string, { score: number }>;
      history[key] = { score: evaluation.score };
      window.localStorage.setItem("ct_drill_history", JSON.stringify(history));

      const forestRaw = window.localStorage.getItem("ct_forest_trees") ?? "0";
      const forestCount = Number.parseInt(forestRaw, 10) || 0;
      window.localStorage.setItem(
        "ct_forest_trees",
        String(Math.max(0, forestCount + 1)),
      );
    }
  };

  const handleBack = () => {
    if (step === 0) {
      router.push("/");
      return;
    }
    setStep((s) => (s - 1) as StepId);
  };

  const isNextDisabled = step >= 1 && !canNext;
  const locked = Boolean(result);
  const showAnswers = Boolean(result);

  const correctedCode = `def sum_to_n(n):
    total = 0
    i = 0
    while i <= n:
        total += i
        i += 1
    return total

print(sum_to_n(5))
`;

  const runLabel =
    runVariant === "original"
      ? "Original code"
      : runVariant === "increment"
        ? "Add i += 1 (recommended)"
        : runVariant === "return_in_loop"
          ? "Move return inside loop"
          : "Change while to i >= n";

  return (
    <main className="min-h-screen flex flex-col px-4 py-6 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            ← Back to home
          </Link>
          <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">
            Daily coding drill
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <div className="space-y-4">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Fix this code
            </h1>
            {!userName && (
              <p className="text-slate-400 text-sm sm:text-base">{DRILL_PROMPT}</p>
            )}

            <div className="mt-4 space-y-4">
              {step === 0 && (
                <div className="space-y-4">
                  <p className="text-base sm:text-lg font-semibold text-slate-100">
                    1. First, see the situation{userName ? ` with ${userName}'s code` : ""}.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3 text-sm">
                    {/* Code */}
                    <div className="sm:col-span-2 space-y-2">
                      <p className="text-lg font-bold text-slate-100">Code</p>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                        <pre className="font-mono text-[14px] sm:text-[15px] text-slate-100 overflow-x-auto">
                          <code>{PYTHON_SNIPPET}</code>
                        </pre>
                      </div>
                    </div>
                    {/* What should be printed */}
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-emerald-100">What should be printed</p>
                      <div className="rounded-2xl border border-emerald-700/60 bg-emerald-900/30 p-4">
                        <p className="text-emerald-100 font-mono">
                          0 + 1 + 2 + 3 + 4 + 5 = <span className="font-bold">15</span>
                        </p>
                        <p className="mt-1 text-[13px] text-emerald-200/90">
                          That&apos;s the goal of <code>sum_to_n(5)</code>.
                        </p>
                      </div>
                    </div>
                    {/* Error */}
                    <div className="sm:col-span-3 space-y-2">
                      <p className="text-lg font-bold text-rose-100">Error</p>
                      <div className="rounded-2xl border border-rose-700/60 bg-rose-950/40 p-4">
                        <p className="text-[13px] text-rose-100">
                          {userName ? (
                            <>
                              <strong>{userName}</strong> is running this code and the program never
                              finishes. Nothing is printed. The laptop fan spins, and it just feels{" "}
                              <strong>&quot;stuck&quot;</strong>.
                            </>
                          ) : (
                            <>
                              You&apos;re running this code and the program never finishes. Nothing
                              is printed. The laptop fan spins, and it just feels{" "}
                              <strong>&quot;stuck&quot;</strong>.
                            </>
                          )}
                        </p>
                        <p className="mt-1 text-[13px] text-rose-200/80">
                          {userName
                            ? `${userName}'s job is to figure out `
                            : "Your job is to figure out "}
                          <span className="font-semibold">why</span> this happens.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <p className="text-base sm:text-lg font-semibold text-slate-100 mb-2">
                    2. What do you think causes {userName ? `${userName}'s` : "this"} code to get stuck?
                  </p>
                  <p className="text-sm sm:text-base text-slate-400 mb-3">
                    Think like a computer and follow the loop. Focus on how{" "}
                    <code>i</code> changes (or does not change) over time.
                  </p>
                  <div className="space-y-2">
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect: false,
                        isSelected:
                          whyStuck ===
                          "The loop adds 0+1+2+3+4+5 to total and then stops.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="why-stuck"
                        value="The loop adds 0+1+2+3+4+5 to total and then stops."
                        checked={
                          whyStuck ===
                          "The loop adds 0+1+2+3+4+5 to total and then stops."
                        }
                        onChange={(e) => setWhyStuck(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        The loop adds 0+1+2+3+4+5 to <code>total</code> and then
                        stops.
                      </span>
                    </label>
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect:
                          "i starts at 0 and never changes, so the loop runs forever and the program never finishes." ===
                          CORRECT_WHY_STUCK,
                        isSelected:
                          whyStuck ===
                          "i starts at 0 and never changes, so the loop runs forever and the program never finishes.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="why-stuck"
                        value="i starts at 0 and never changes, so the loop runs forever and the program never finishes."
                        checked={
                          whyStuck ===
                          "i starts at 0 and never changes, so the loop runs forever and the program never finishes."
                        }
                        onChange={(e) => setWhyStuck(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        <code>i</code> starts at 0 and never changes, so the
                        loop runs forever and the program never finishes.
                      </span>
                    </label>
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect: false,
                        isSelected: whyStuck === "The loop never runs at all.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="why-stuck"
                        value="The loop never runs at all."
                        checked={whyStuck === "The loop never runs at all."}
                        onChange={(e) => setWhyStuck(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        The loop never runs at all.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="text-base sm:text-lg font-semibold text-slate-100 mb-2">
                    3. Which part of {userName ? `${userName}'s` : "the"} code is really to blame?
                  </p>
                  <p className="text-sm sm:text-base text-slate-400 mb-3">
                    Pick the part that most directly causes the program to get
                    stuck.
                  </p>
                  <div className="space-y-2">
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect:
                          "The while condition 'while i <= n:' combined with never changing i." ===
                          CORRECT_BUG_PART,
                        isSelected:
                          bugPart ===
                          "The while condition 'while i <= n:' combined with never changing i.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="bug-part"
                        value="The while condition 'while i <= n:' combined with never changing i."
                        checked={
                          bugPart ===
                          "The while condition 'while i <= n:' combined with never changing i."
                        }
                        onChange={(e) => setBugPart(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        The <code>while i &lt;= n:</code> condition combined
                        with never changing <code>i</code>.
                      </span>
                    </label>
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect: false,
                        isSelected: bugPart === "The line 'total += i'.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="bug-part"
                        value="The line 'total += i'."
                        checked={bugPart === "The line 'total += i'."}
                        onChange={(e) => setBugPart(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        The line <code>total += i</code>.
                      </span>
                    </label>
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect: false,
                        isSelected: bugPart === "The return statement 'return total'.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="bug-part"
                        value="The return statement 'return total'."
                        checked={bugPart === "The return statement 'return total'."}
                        onChange={(e) => setBugPart(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        The return statement <code>return total</code>.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="text-base sm:text-lg font-semibold text-slate-100 mb-2">
                    4. Last step: how would you fix {userName ? `${userName}'s` : "this"} code?
                  </p>
                  <p className="text-sm sm:text-base text-slate-400 mb-3">
                    Choose the change that would make the function run and print
                    the correct sum.
                  </p>
                  <div className="space-y-2">
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect:
                          "Add 'i += 1' inside the loop so i increases each time." ===
                          CORRECT_FIX,
                        isSelected:
                          fixChoice ===
                          "Add 'i += 1' inside the loop so i increases each time.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="fix"
                        value="Add 'i += 1' inside the loop so i increases each time."
                        checked={
                          fixChoice ===
                          "Add 'i += 1' inside the loop so i increases each time."
                        }
                        onChange={(e) => setFixChoice(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        Add <code>i += 1</code> inside the loop so{" "}
                        <code>i</code> increases each time.
                      </span>
                    </label>
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect: false,
                        isSelected:
                          fixChoice === "Move 'return total' inside the loop.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="fix"
                        value="Move 'return total' inside the loop."
                        checked={fixChoice === "Move 'return total' inside the loop."}
                        onChange={(e) => setFixChoice(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        Move <code>return total</code> inside the loop.
                      </span>
                    </label>
                    <label
                      className={optionStyles({
                        showAnswers,
                        isCorrect: false,
                        isSelected:
                          fixChoice ===
                          "Change the while condition to 'while i >= n:'.",
                        locked,
                      })}
                    >
                      <input
                        type="radio"
                        name="fix"
                        value="Change the while condition to 'while i >= n:'."
                        checked={
                          fixChoice ===
                          "Change the while condition to 'while i >= n:'."
                        }
                        onChange={(e) => setFixChoice(e.target.value)}
                        disabled={locked}
                        className="mt-1 h-4 w-4 accent-blue-500 disabled:opacity-60"
                      />
                      <span className="text-sm sm:text-base text-slate-100">
                        Change the while condition to <code>while i &gt;= n:</code>.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-900/60 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-4 py-2 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={isNextDisabled}
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 text-xs sm:text-sm transition-colors min-h-[44px] shrink-0"
              >
                {step < 3 ? "Next" : "See feedback"}
              </button>
            </div>

            {result && (
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Try a fix and run it
                    </p>
                    <p className="text-sm sm:text-base text-slate-200 font-semibold mt-1">
                      {userName ? `${userName}` : "You"} can now apply a fix and see what it would print.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                      setWhyStuck("");
                      setBugPart("");
                      setFixChoice("");
                      setResult(null);
                      setRunVariant("original");
                      setRunResult(null);
                    }}
                    className="shrink-0 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-900/60 px-3 py-2 text-xs transition-colors"
                  >
                    New attempt
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRunVariant("original")}
                    className={`rounded-xl px-3 py-2 text-xs sm:text-sm border transition-colors ${
                      runVariant === "original"
                        ? "border-blue-500/70 bg-blue-500/15 text-blue-200"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-900/60"
                    }`}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    onClick={() => setRunVariant("increment")}
                    className={`rounded-xl px-3 py-2 text-xs sm:text-sm border transition-colors ${
                      runVariant === "increment"
                        ? "border-blue-500/70 bg-blue-500/15 text-blue-200"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-900/60"
                    }`}
                  >
                    Add i += 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setRunVariant("return_in_loop")}
                    className={`rounded-xl px-3 py-2 text-xs sm:text-sm border transition-colors ${
                      runVariant === "return_in_loop"
                        ? "border-blue-500/70 bg-blue-500/15 text-blue-200"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-900/60"
                    }`}
                  >
                    Return inside loop
                  </button>
                  <button
                    type="button"
                    onClick={() => setRunVariant("while_ge")}
                    className={`rounded-xl px-3 py-2 text-xs sm:text-sm border transition-colors ${
                      runVariant === "while_ge"
                        ? "border-blue-500/70 bg-blue-500/15 text-blue-200"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-900/60"
                    }`}
                  >
                    Use i ≥ n
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-sm font-bold text-slate-100 mb-2">Code preview</p>
                    <p className="text-xs text-slate-500 mb-3">
                      Showing: <span className="text-slate-300">{runLabel}</span>
                    </p>
                    <pre className="font-mono text-[13px] sm:text-[14px] text-slate-100 overflow-x-auto">
                      <code>
                        {runVariant === "increment" ? correctedCode : PYTHON_SNIPPET}
                      </code>
                    </pre>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-sm font-bold text-slate-100 mb-2">Run result (n = 5)</p>
                    <button
                      type="button"
                      onClick={() => setRunResult(simulateSumToN(5, runVariant))}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 text-xs sm:text-sm transition-colors"
                    >
                      Run it
                    </button>

                    {runResult && (
                      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                        {runResult.status === "stuck" ? (
                          <>
                            <p className="text-sm text-rose-200 font-semibold">Still stuck</p>
                            <p className="text-xs text-rose-200/80 mt-1">
                              It didn&apos;t finish within a safe step limit.
                            </p>
                          </>
                        ) : runResult.status === "ok" ? (
                          <>
                            <p className="text-sm text-emerald-200 font-semibold">Printed: 15</p>
                            <p className="text-xs text-emerald-200/80 mt-1">
                              Correct — the function finishes and returns the right sum.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-amber-200 font-semibold">
                              Printed: {runResult.output}
                            </p>
                            <p className="text-xs text-amber-200/80 mt-1">
                              It finishes, but the output is not 15.
                            </p>
                          </>
                        )}
                        <p className="text-[11px] text-slate-500 mt-2">
                          Simulated steps: {runResult.steps.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    Each finished drill also plants a tree in your{" "}
                    <span className="font-semibold text-slate-200">
                      thinking forest
                    </span>
                    .
                  </p>
                  <Link
                    href="/forest"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 text-xs sm:text-sm transition-colors"
                  >
                    View your forest
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 sm:px-5 sm:py-5 flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl sm:text-3xl">
                <span>{stage.emoji}</span>
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Today&apos;s reasoning score
                </p>
                <p className="text-3xl font-display font-bold text-blue-400">
                  {score != null ? `${score} / 100` : "—"}
                </p>
                <p className="text-xs text-slate-400 mt-1">{stage.label}</p>
              </div>
            </div>

            {result && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">
                    What you did well
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {result.strengths.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Try next time
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {result.improvements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
