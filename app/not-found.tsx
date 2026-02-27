import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-950 text-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-display text-2xl font-bold text-white">
          Page not found
        </h1>
        <p className="text-slate-400 text-sm">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
