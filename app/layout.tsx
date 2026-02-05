import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wedding Planner",
  description: "Plan your perfect wedding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-rose-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">💍 Wedding Planner</h1>
            <div className="flex gap-6">
              <a href="/" className="hover:text-rose-200">Dashboard</a>
              <a href="/venues" className="hover:text-rose-200">Venues</a>
              <a href="/tasks" className="hover:text-rose-200">Tasks</a>
              <a href="/guests" className="hover:text-rose-200">Guests</a>
              <a href="/budget" className="hover:text-rose-200">Budget</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
