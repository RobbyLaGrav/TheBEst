"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function QuickCapture() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const addInboxItem = useStore((s) => s.addInboxItem);

  const submit = () => {
    if (!text.trim()) return;
    addInboxItem(text.trim());
    setText("");
    setOpen(false);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg"
        style={{ background: "var(--accent)", color: "#000" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        +
      </motion.button>

      {/* Quick capture modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                Quick Capture
              </h3>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                Dump it here. Sort it later.
              </p>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full rounded-xl p-4 text-sm outline-none resize-none"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  minHeight: "100px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                }}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  ⌘+Enter to save
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: "var(--accent)", color: "#000" }}
                  >
                    Send to Inbox
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
