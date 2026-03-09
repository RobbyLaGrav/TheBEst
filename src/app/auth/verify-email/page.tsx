"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"pending" | "verifying" | "success" | "error">(token ? "verifying" : "pending");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => router.push("/"), 3000);
        } else {
          setStatus("error");
          setError(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Something went wrong");
      });
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="rounded-2xl p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {status === "pending" && (
            <>
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Check your email</h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                We sent a verification link to <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Click the link in the email to verify your account. Check spam if you don&apos;t see it.
              </p>
              <Link href="/" className="inline-block mt-6 px-6 py-2.5 rounded-xl text-sm font-medium no-underline"
                style={{ background: "var(--accent)", color: "#000" }}>
                Continue to MindVault
              </Link>
            </>
          )}
          {status === "verifying" && (
            <>
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Verifying your email...</h2>
            </>
          )}
          {status === "success" && (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#22c55e" }}>Email verified!</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Redirecting to your dashboard...</p>
            </>
          )}
          {status === "error" && (
            <>
              <div className="text-5xl mb-4">❌</div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#ef4444" }}>Verification failed</h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{error}</p>
              <Link href="/auth/login" className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium no-underline"
                style={{ background: "var(--accent)", color: "#000" }}>
                Back to login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg-primary)" }} />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
