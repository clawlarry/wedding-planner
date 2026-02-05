import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MobileNav from "./components/MobileNav";
import PasswordGate from "./components/PasswordGate";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wedding Planner",
  description: "Plan your perfect day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-gradient-to-br from-rose-50/50 via-white to-rose-100/30 min-h-screen">
        <PasswordGate>
          <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-rose-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <a href="/" className="flex items-center gap-2 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">💍</span>
                  <span className="font-serif text-xl font-bold bg-gradient-to-r from-rose-700 to-rose-500 bg-clip-text text-transparent hidden sm:block">
                    Our Wedding
                  </span>
                </a>
                
                <div className="hidden md:flex items-center gap-1">
                  {[
                    { href: "/", label: "Home", icon: "🏠" },
                    { href: "/venues", label: "Venues", icon: "📍" },
                    { href: "/tasks", label: "Tasks", icon: "✓" },
                    { href: "/guests", label: "Guests", icon: "👥" },
                    { href: "/budget", label: "Budget", icon: "💰" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-rose-700 hover:bg-rose-50/80 transition-all duration-200"
                    >
                      <span className="mr-1.5">{link.icon}</span>
                      {link.label}
                    </a>
                  ))}
                </div>
                
                <MobileNav />
              </div>
            </div>
          </nav>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {children}
          </main>
        </PasswordGate>
      </body>
    </html>
  );
}
