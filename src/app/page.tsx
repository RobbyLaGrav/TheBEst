"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export default function InboxPage() {
  const inbox = useStore((s) => s.inbox);
  const deleteInboxItem = useStore((s) => s.deleteInboxItem);
  const processInboxItem = useStore((s) => s.processInboxItem);
  const addNote = useStore((s) => s.addNote);
  const addIdea = useStore((s) => s.addIdea);
  const addTask = useStore((s) => s.addTask);

  const notes = useStore((s) => s.notes);
  const ideas = useStore((s) => s.ideas);
  const tasks = useStore((s) => s.tasks);
  const goals = useStore((s) => s.goals);

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter((t) => !t.completed && t.dueDate && t.dueDate <= today).slice(0, 5);
  }, [tasks]);

  const randomIdeas = useMemo(() => {
    const active = ideas.filter((i) => !i.archived);
    const shuffled = [...active].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [ideas]);

  const activeGoals = useMemo(() => goals.slice(0, 3), [goals]);
  const unprocessed = inbox.filter((i) => !i.processed);

  const sendTo = (item: typeof inbox[0], target: "note" | "idea" | "task") => {
    if (target === "note") addNote(item.content.slice(0, 50), item.content);
    else if (target === "idea") addIdea(item.content.slice(0, 50), item.content);
    else addTask(item.content);
    processInboxItem(item.id);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
        Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>

      {/* Daily Digest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Due Today
          </h3>
          {todayTasks.length === 0 && <p className="text-sm" style={{ color: "var(--text-muted)" }}>All clear!</p>}
          {todayTasks.map((t) => (
            <p key={t.id} className="text-sm mb-1 truncate" style={{ color: "var(--text-secondary)" }}>• {t.title}</p>
          ))}
        </div>
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Random Ideas
          </h3>
          {randomIdeas.length === 0 && <p className="text-sm" style={{ color: "var(--text-muted)" }}>No ideas yet</p>}
          {randomIdeas.map((i) => (
            <p key={i.id} className="text-sm mb-1 truncate" style={{ color: "var(--text-secondary)" }}>• {i.title}</p>
          ))}
        </div>
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Goals
          </h3>
          {activeGoals.length === 0 && <p className="text-sm" style={{ color: "var(--text-muted)" }}>Set some goals!</p>}
          {activeGoals.map((g) => (
            <div key={g.id} className="mb-2">
              <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>{g.title}</p>
              <div className="h-1 rounded-full mt-1" style={{ background: "#222" }}>
                <div className="h-full rounded-full" style={{ background: "var(--accent)", width: `${g.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inbox */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Inbox
          {unprocessed.length > 0 && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "#000" }}>
              {unprocessed.length}
            </span>
          )}
        </h2>
      </div>

      {unprocessed.length === 0 && (
        <div className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-4xl mb-3">📥</p>
          <p className="font-medium" style={{ color: "var(--text-secondary)" }}>Inbox Zero</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Hit the + button to capture something</p>
        </div>
      )}

      <AnimatePresence>
        {unprocessed.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="rounded-2xl p-5 mb-3"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm mb-3" style={{ color: "var(--text-primary)" }}>{item.content}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs mr-2" style={{ color: "var(--text-muted)" }}>Send to:</span>
              {(["note", "idea", "task"] as const).map((t) => (
                <button key={t} onClick={() => sendTo(item, t)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  {t === "note" ? "🧠 Note" : t === "idea" ? "⚡ Idea" : "🔥 Task"}
                </button>
              ))}
              <button onClick={() => deleteInboxItem(item.id)}
                className="ml-auto text-xs px-3 py-1.5 rounded-lg" style={{ color: "#ef4444" }}>
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
