import React, { useState } from "react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite?: () => void;
}

export const ADMIN_AUTH_KEY = "august_admin_authenticated";

export function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Authorized credentials
  const VALID_USER = (import.meta.env.VITE_ADMIN_USER || "admin").toLowerCase();
  const VALID_USER_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "admin@augustaurea.co.tz").toLowerCase();
  const VALID_PASS = import.meta.env.VITE_ADMIN_PASSWORD || "August@2026";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      if ((cleanUser === VALID_USER || cleanUser === VALID_USER_EMAIL) && password === VALID_PASS) {
        const authData = JSON.stringify({
          authenticated: true,
          user: cleanUser,
          loggedInAt: new Date().toISOString(),
        });
        if (rememberMe) {
          localStorage.setItem(ADMIN_AUTH_KEY, authData);
        } else {
          sessionStorage.setItem(ADMIN_AUTH_KEY, authData);
        }
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError("Invalid username or password. Please check your credentials.");
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUsername("admin");
    setPassword("August@2026");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-[#e2dfef] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fe9201]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-[#0e0a1a]/90 backdrop-blur-2xl border border-[#2a2245] rounded-3xl p-8 shadow-2xl shadow-black/80">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fe9201] to-[#ffb653] text-[#080300] font-black text-2xl shadow-lg shadow-[#fe9201]/30 mb-4">
              AA
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">AuGust Aurea</h1>
            <p className="text-xs text-[#a59ebf] mt-1 font-medium">
              Management & Live CMS Administration Portal
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a142e] border border-[#2e2450] rounded-full text-[10px] text-emerald-400 font-mono mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Secure Database Connection: Online
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-rose-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-[#c4bddf] uppercase tracking-wider mb-2">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#756c98]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or admin@augustaurea.co.tz"
                  className="w-full pl-10 pr-4 py-3 bg-[#150f26] border border-[#2f254e] rounded-xl text-white text-sm outline-none focus:border-[#fe9201] focus:ring-1 focus:ring-[#fe9201] transition-all placeholder:text-[#5f567f]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#c4bddf] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#756c98]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-[#150f26] border border-[#2f254e] rounded-xl text-white text-sm outline-none focus:border-[#fe9201] focus:ring-1 focus:ring-[#fe9201] transition-all placeholder:text-[#5f567f]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#756c98] hover:text-white transition cursor-pointer"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-[#9d95be]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#2f254e] bg-[#150f26] text-[#fe9201] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember session on this device</span>
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[#fe9201] hover:underline font-semibold text-[11px]"
              >
                Auto-fill credentials
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#fe9201] to-[#e68300] hover:from-[#ffa01c] hover:to-[#fe9201] text-[#080300] font-black rounded-xl text-sm transition-all shadow-lg shadow-[#fe9201]/25 hover:shadow-[#fe9201]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#080300]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Credentials Info Box */}
          <div className="mt-6 p-3.5 bg-[#140e24] border border-[#271e42] rounded-2xl">
            <div className="text-[11px] font-bold text-[#fe9201] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Admin Access Credentials</span>
              <span className="text-[9px] text-[#867da6] font-normal">Pre-configured</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#cfc9e5] font-mono mt-1.5">
              <div>
                <span className="text-[10px] text-[#716893] block">Username:</span>
                <span className="font-bold text-white selection:bg-[#fe9201]">admin</span>
              </div>
              <div>
                <span className="text-[10px] text-[#716893] block">Password:</span>
                <span className="font-bold text-white selection:bg-[#fe9201]">August@2026</span>
              </div>
            </div>
          </div>

          {/* Footer Back Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBackToSite ? onBackToSite : () => (window.location.href = "/")}
              className="text-xs text-[#8c84ad] hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
