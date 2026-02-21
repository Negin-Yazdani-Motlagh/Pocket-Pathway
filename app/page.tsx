"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-4 py-4 sm:px-6">
        <nav className="max-w-4xl mx-auto flex items-center justify-end gap-6 sm:gap-8">
          <Link href="/" className="text-slate-300 hover:text-white font-medium transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-slate-300 hover:text-white font-medium transition-colors">
            About us
          </Link>
          <Link href="/contact" className="text-slate-300 hover:text-white font-medium transition-colors">
            Contact us
          </Link>
        </nav>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full text-center animate-fade-in">
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white mb-4">
          Pocket Pathway
        </h1>
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
          Turn minutes into mastery
        </p>
        <Link
          href="/topics"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-4 text-lg shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          START
        </Link>
      </div>
      </div>
    </main>
  );
}
