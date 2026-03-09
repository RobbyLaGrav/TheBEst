"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>MINDVAULT</h1>
        </div>
        <div className="rounded-2xl p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Check your email</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                If an account exists for {email}, we&apos;ve sent a password reset link.
              </p>
              <Link href="/auth/login" className="text-sm font-medium no-underline" style={{ color: "var(--accent)" }}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Reset your password</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--accent)", color: "#000", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
              <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
                <Link href="/auth/login" className="no-underline" style={{ color: "var(--accent)" }}>Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
