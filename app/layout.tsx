import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-clash",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pocket Pathway — Learn Your Way",
  description: "A short learning preferences quiz and a personalized math lesson.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${sora.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen bg-mesh">
        {children}
      </body>
    </html>
  );
}
