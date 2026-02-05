"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/venues", label: "Venues", icon: "📍" },
    { href: "/tasks", label: "Tasks", icon: "✓" },
    { href: "/guests", label: "Guests", icon: "👥" },
    { href: "/budget", label: "Budget", icon: "💰" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl hover:bg-rose-50 text-gray-600 hover:text-rose-700 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-rose-100 shadow-xl animate-fade-in">
          <div className="flex flex-col p-4 space-y-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-all font-medium"
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
