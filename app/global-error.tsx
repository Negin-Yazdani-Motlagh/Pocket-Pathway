"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-white">
            Something went wrong
          </h1>
          <p className="text-slate-400 text-sm">
            A critical error occurred. Try refreshing the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
