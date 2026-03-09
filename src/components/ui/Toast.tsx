"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let addToastFn: ((message: string, type?: Toast["type"]) => void) | null = null;

export function toast(message: string, type: Toast["type"] = "info") {
  if (addToastFn) addToastFn(message, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const colors = {
    success: { bg: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)", text: "#22c55e" },
    error: { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444" },
    info: { bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.3)", text: "#3b82f6" },
  };

  return (
    <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="px-4 py-3 rounded-xl text-sm font-medium shadow-lg backdrop-blur-md min-w-[280px]"
            style={{
              background: colors[t.type].bg,
              border: `1px solid ${colors[t.type].border}`,
              color: colors[t.type].text,
            }}
          >
            {t.type === "success" && "✓ "}{t.type === "error" && "✕ "}{t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
