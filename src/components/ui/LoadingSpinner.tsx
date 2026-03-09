"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="3" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={40} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading MindVault...</p>
      </div>
    </div>
  );
}
