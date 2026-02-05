"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("wedding-auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Welcome1") {
      localStorage.setItem("wedding-auth", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("wedding-auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-200">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                💍 Wedding Planner
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Private access only
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400 ${
                    error
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm text-center animate-pulse">
                  Incorrect password. Please try again.
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Unlock
              </button>
            </form>

            <p className="text-center text-gray-400 text-xs mt-6">
              Protected content • Authorized access only
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-xs font-medium text-gray-600 hover:text-rose-600 hover:bg-white transition-all border border-gray-200 z-50"
      >
        🔒 Lock
      </button>
    </>
  );
}
