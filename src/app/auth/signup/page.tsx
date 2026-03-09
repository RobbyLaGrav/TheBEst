"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useStore } from "@/store/useStore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const setServerMode = useStore((s) => s.setServerMode);

  const passwordStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "#ef4444", "#eab308", "#22c55e"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const result = await signup(email, password, name);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setServerMode(true);
    router.push("/auth/verify-email?email=" + encodeURIComponent(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
            MINDVAULT
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Create your personal command center
          </p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
            Create account
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl text-sm"
              style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444" }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#222" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(passwordStrength / 3) * 100}%`, background: strengthColors[passwordStrength] }} />
                  </div>
                  <span className="text-xs" style={{ color: strengthColors[passwordStrength] }}>{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Passwords don&apos;t match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2"
              style={{ background: loading ? "var(--accent-dim)" : "var(--accent)", color: "#000", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium no-underline" style={{ color: "var(--accent)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
