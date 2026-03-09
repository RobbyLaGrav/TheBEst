"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setSuccess(true);
    setTimeout(() => router.push("/auth/login"), 3000);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center">
          <p style={{ color: "var(--text-secondary)" }}>Invalid reset link</p>
          <Link href="/auth/forgot-password" className="text-sm mt-4 inline-block no-underline" style={{ color: "var(--accent)" }}>
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {success ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#22c55e" }}>Password reset!</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Redirecting to sign in...</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Set new password</h2>
              {error && (
                <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>New password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min 8 characters"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Confirm password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--accent)", color: "#000", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg-primary)" }} />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
