"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAME_KEY = "pocket_pathway_user_name";

export default function HomePage() {
  const [name, setName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(NAME_KEY);
      if (saved) setName(saved);
    }
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setName(value);
    if (typeof window !== "undefined") {
      if (value) window.localStorage.setItem(NAME_KEY, value);
      else window.localStorage.removeItem(NAME_KEY);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-4 py-4 sm:px-6">
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <div className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
            Pocket Pathway
          </div>
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="text-slate-300 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-white font-medium transition-colors">
              Contact
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center animate-fade-in">
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white mb-4">
            Turn minutes into{" "}
            <span className="text-blue-400">real coding mastery</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Short daily coding drills that help you spot issues, explain your
            thinking, and become a more confident problem solver.
          </p>

          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-full max-w-xs mx-auto mb-2">
              <label htmlFor="user-name" className="block text-left text-sm font-medium text-slate-300 mb-1">
                What should we call you?
              </label>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Negin"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
              />
            </div>
            <Link
              href="/drill"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-4 text-lg shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start today&apos;s coding drill
            </Link>
            <p className="text-slate-500 text-sm">
              No accounts, no timers — just one focused thinking exercise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-sm">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="font-semibold text-slate-100 mb-1">
                Decomposition
              </p>
              <p className="text-slate-400">
                Practice breaking problems into clear, logical steps instead of
                guessing at code.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="font-semibold text-slate-100 mb-1">
                Debugging reasoning
              </p>
              <p className="text-slate-400">
                Explain what the bug is, why it happens, and how you would fix
                it.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="font-semibold text-slate-100 mb-1">
                Visible growth
              </p>
              <p className="text-slate-400">
                Build a streak, see your scores trend upward, and watch your
                thinking plant evolve over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
