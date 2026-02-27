"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ForestStats = {
  trees: number;
};

export default function ForestPage() {
  const [stats, setStats] = useState<ForestStats>({ trees: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("ct_forest_trees") ?? "0";
    const trees = Number.parseInt(raw, 10) || 0;
    setStats({ trees: Math.max(0, trees) });
  }, []);

  const clampedTrees = Math.min(stats.trees, 12);
  const hasAnyTrees = clampedTrees > 0;

  return (
    <main className="min-h-screen flex flex-col px-4 py-6 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/drill"
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            ← Back to today&apos;s drill
          </Link>
          <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">
            Thinking forest
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr] items-start">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/80 p-5 sm:p-6 overflow-hidden relative">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />
              <div className="relative space-y-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Your thinking forest
                </h1>
                <p className="text-sm sm:text-base text-slate-300">
                  At the beginning, this jungle was almost{" "}
                  <span className="font-semibold text-slate-100">
                    burned and empty
                  </span>
                  . Each finished coding drill plants one living tree back into
                  the forest.
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  {hasAnyTrees ? (
                    <>
                      Today&apos;s drill added{" "}
                      <span className="font-semibold text-emerald-300">
                        one tree
                      </span>{" "}
                      to your forest. Keep returning and you&apos;ll slowly turn
                      this place green again.
                    </>
                  ) : (
                    <>
                      Once you finish your first drill, the{" "}
                      <span className="font-semibold text-emerald-300">
                        very first tree
                      </span>{" "}
                      will appear here.
                    </>
                  )}
                </p>
              </div>

              <div className="relative mt-6 h-48 sm:h-56 overflow-hidden rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
                {/* smoky burned background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.05),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),transparent_55%)]" />

                {/* distant burned trunks */}
                <div className="absolute inset-x-0 bottom-10 flex justify-between px-4 opacity-40">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-xs text-slate-700"
                    >
                      <div className="w-[2px] h-16 bg-slate-700 rounded-full" />
                      <span className="mt-1">🪵</span>
                    </div>
                  ))}
                </div>

                {/* living trees earned */}
                <div className="absolute inset-x-0 bottom-2 flex items-end justify-center gap-3 sm:gap-4 px-4">
                  {clampedTrees === 0 ? (
                    <p className="text-[11px] sm:text-xs text-slate-400 text-center max-w-xs">
                      The forest is still quiet. Your first finished drill will
                      plant a bright green tree here.
                    </p>
                  ) : (
                    Array.from({ length: clampedTrees }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center animate-[fade-in_0.6s_ease-out]"
                        style={{
                          animationDelay: `${idx * 60}ms`,
                        }}
                      >
                        <span className="text-2xl sm:text-3xl drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]">
                          {idx === clampedTrees - 1 && stats.trees > 0
                            ? "🌸"
                            : "🌳"}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* ground */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-emerald-900/70 via-emerald-800/40 to-transparent" />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 sm:px-5 sm:py-5 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Forest status
              </p>
              <p className="text-2xl font-display font-semibold text-emerald-300">
                {stats.trees}{" "}
                <span className="text-sm font-normal text-slate-400">
                  {stats.trees === 1 ? "tree" : "trees"}
                </span>
              </p>
              <p className="text-xs text-slate-400">
                Every day you finish a drill, another tree appears here. If you
                stop for a while, the forest doesn&apos;t disappear — it just
                waits for the next tree.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 sm:px-5 sm:py-5 space-y-3">
              <p className="text-xs font-semibold text-slate-100">
                How this connects to your learning
              </p>
              <p className="text-xs text-slate-400">
                The forest is a visual reminder that{" "}
                <span className="font-semibold text-slate-200">
                  small, consistent drills
                </span>{" "}
                build strong thinking habits over time — just like small trees
                slowly grow into a healthy jungle.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-2 text-xs sm:text-sm transition-colors"
              >
                Go back to home
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

