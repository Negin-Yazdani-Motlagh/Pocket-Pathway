"use client";

import Link from "next/link";

const TOPICS = [
  {
    id: "math",
    name: "Math",
    description: "Fractions, numbers, and problem-solving",
    icon: "∑",
    href: "/lesson?topic=math",
  },
  {
    id: "history",
    name: "History",
    description: "Key events and ideas from the past",
    icon: "📜",
    href: "/lesson?topic=history",
  },
] as const;

export default function TopicsPage() {
  return (
    <main className="min-h-screen flex flex-col px-4 py-8 sm:px-6">
      <div className="max-w-lg mx-auto w-full">
        <Link
          href="/"
          className="text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors inline-block"
        >
          ← Home
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
          Choose a topic
        </h1>
        <p className="text-slate-400 mb-8">
          Pick one to see a short lesson and two practice questions.
        </p>
        <ul className="space-y-4">
          {TOPICS.map((topic) => (
            <li key={topic.id}>
              <Link
                href={topic.href}
                className="block rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-200 card-hover group"
              >
                <span className="text-3xl mb-3 block">{topic.icon}</span>
                <h2 className="font-display text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {topic.name}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{topic.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
