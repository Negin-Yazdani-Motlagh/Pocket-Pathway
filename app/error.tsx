"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-950 text-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-display text-2xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="text-slate-400 text-sm">
          The page hit an error. You can try again or go back home.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
