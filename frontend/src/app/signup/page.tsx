"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Github, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/email/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/home");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-glow -z-10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary mb-8 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="bg-bg-secondary/50 backdrop-blur-xl border border-border-subtle rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-text-primary font-semibold text-xl tracking-tight">
                Voltex
              </span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
                Create your account
              </h1>
              <p className="text-text-secondary text-sm">
                Start deploying in seconds
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-3 w-full py-3 bg-bg-tertiary border border-border-subtle rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:border-border transition-all duration-200 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </a>

              <a
                href="/api/auth/login"
                className="flex items-center justify-center gap-3 w-full py-3 bg-bg-tertiary border border-border-subtle rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover hover:border-border transition-all duration-200 group"
              >
                <Github className="w-5 h-5" />
                <span className="font-medium">Continue with GitHub</span>
              </a>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-bg-secondary text-text-muted">
                  or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-premium pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Work email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium pl-10"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium pl-10"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3 h-3 ${req.met ? "text-success" : "text-text-muted"}`} />
                        <span className={req.met ? "text-text-secondary" : "text-text-muted"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="text-text-muted text-center mt-8 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-text-muted text-xs text-center mt-6">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-text-secondary hover:text-text-primary">Terms</a>{" "}
            and{" "}
            <a href="#" className="text-text-secondary hover:text-text-primary">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}