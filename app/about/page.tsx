import Link from "next/link";

export default function AboutPage() {
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
      <div className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
          About us
        </h1>
        <p className="text-slate-400 leading-relaxed">
          Pocket Pathway helps you learn in short, focused sessions. Pick a topic, watch a quick lesson, and practice with a couple of questions. Your progress is saved so you can keep building over time.
        </p>
        <Link href="/" className="inline-block mt-6 text-blue-400 hover:text-blue-300 font-medium">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
