"use client";

import { useState } from "react";
import { useStore, TaskPriority } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const PRIORITY_STYLES: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  Chill: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Chill" },
  Important: { color: "#eab308", bg: "rgba(234,179,8,0.1)", label: "Important" },
  URGENT: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "URGENT" },
};

export default function FireListPage() {
  const tasks = useStore((s) => s.tasks);
  const addTask = useStore((s) => s.addTask);
  const toggleTask = useStore((s) => s.toggleTask);
  const updateTask = useStore((s) => s.updateTask);
  const deleteTask = useStore((s) => s.deleteTask);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Chill");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");

  const submit = () => {
    if (!title.trim()) return;
    addTask(title, priority, dueDate || null);
    setTitle("");
    setDueDate("");
  };

  const visible = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const sorted = [...visible].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pOrder = { URGENT: 0, Important: 1, Chill: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">🔥 Fire List</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        {tasks.filter((t) => !t.completed).length} active / {tasks.filter((t) => t.completed).length} completed
      </p>

      {/* Add form */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex gap-2 mb-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to get done?"
            className="flex-1 rounded-xl p-3 text-sm outline-none"
            style={{ background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
          <button onClick={submit}
            className="px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
            style={{ background: "var(--accent)", color: "#000" }}>
            Add
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {(["Chill", "Important", "URGENT"] as TaskPriority[]).map((p) => (
              <button key={p} onClick={() => setPriority(p)}
                className="text-xs px-3 py-1 rounded-lg font-medium transition-all"
                style={{
                  background: priority === p ? PRIORITY_STYLES[p].bg : "transparent",
                  color: priority === p ? PRIORITY_STYLES[p].color : "var(--text-muted)",
                  border: `1px solid ${priority === p ? PRIORITY_STYLES[p].color : "var(--border)"}`,
                }}>
                {p === "URGENT" ? "🔴 " : ""}{p}
              </button>
            ))}
          </div>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="text-xs rounded-lg p-1.5 outline-none"
            style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }} />
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(["active", "completed", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all capitalize"
            style={{
              background: filter === f ? "var(--accent-glow)" : "var(--bg-card)",
              color: filter === f ? "var(--accent)" : "var(--text-secondary)",
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        <AnimatePresence>
          {sorted.map((task) => (
            <motion.div key={task.id} layout
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
              className="rounded-xl p-4 flex items-center gap-3 group"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

              {/* Checkbox */}
              <button onClick={() => toggleTask(task.id)}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: task.completed ? "var(--accent)" : PRIORITY_STYLES[task.priority].color,
                  background: task.completed ? "var(--accent)" : "transparent",
                }}>
                {task.completed && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="text-[10px]" style={{ color: "#000" }}>✓</motion.span>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{
                  color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
                  textDecoration: task.completed ? "line-through" : "none",
                }}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: PRIORITY_STYLES[task.priority].bg, color: PRIORITY_STYLES[task.priority].color }}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Due: {new Date(task.dueDate + "T00:00:00").toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Priority cycle */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {(["Chill", "Important", "URGENT"] as TaskPriority[]).map((p) => (
                  <button key={p} onClick={() => updateTask(task.id, { priority: p })}
                    className="w-2 h-2 rounded-full" style={{ background: PRIORITY_STYLES[p].color, opacity: task.priority === p ? 1 : 0.3 }} />
                ))}
                <button onClick={() => deleteTask(task.id)}
                  className="text-xs ml-2" style={{ color: "#ef4444" }}>✕</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && (
        <div className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-4xl mb-3">🔥</p>
          <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
            {filter === "completed" ? "Nothing completed yet" : "All clear!"}
          </p>
        </div>
      )}
    </div>
  );
}
