"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const notes = useStore((s) => s.notes);
  const ideas = useStore((s) => s.ideas);
  const businessIdeas = useStore((s) => s.businessIdeas);
  const tasks = useStore((s) => s.tasks);
  const goals = useStore((s) => s.goals);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items: { type: string; title: string; href: string; icon: string }[] = [];

    notes.filter((n) => !n.archived && (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)))
      .slice(0, 3).forEach((n) => items.push({ type: "Note", title: n.title, href: "/braindump", icon: "🧠" }));

    ideas.filter((i) => !i.archived && (i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)))
      .slice(0, 3).forEach((i) => items.push({ type: "Idea", title: i.title, href: "/spark", icon: "⚡" }));

    businessIdeas.filter((b) => b.title.toLowerCase().includes(q) || b.problem.toLowerCase().includes(q))
      .slice(0, 3).forEach((b) => items.push({ type: "Business", title: b.title, href: "/empire", icon: "🏛️" }));

    tasks.filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 3).forEach((t) => items.push({ type: "Task", title: t.title, href: "/firelist", icon: "🔥" }));

    goals.filter((g) => g.title.toLowerCase().includes(q))
      .slice(0, 3).forEach((g) => items.push({ type: "Goal", title: g.title, href: "/goals", icon: "🎯" }));

    // Nav shortcuts
    const navItems = [
      { label: "Inbox", href: "/", icon: "📥" },
      { label: "Brain Dump", href: "/braindump", icon: "🧠" },
      { label: "Spark / Ideas", href: "/spark", icon: "⚡" },
      { label: "Empire / Business", href: "/empire", icon: "🏛️" },
      { label: "Fire List / Tasks", href: "/firelist", icon: "🔥" },
      { label: "Rituals / Habits", href: "/rituals", icon: "🔁" },
      { label: "Goals", href: "/goals", icon: "🎯" },
      { label: "Vault", href: "/vault", icon: "🔒" },
      { label: "Stats", href: "/stats", icon: "📊" },
    ];
    navItems
      .filter((n) => n.label.toLowerCase().includes(q))
      .forEach((n) => items.push({ type: "Navigate", title: n.label, href: n.href, icon: n.icon }));

    return items;
  }, [query, notes, ideas, businessIdeas, tasks, goals]);

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-[560px] max-w-[90vw] rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search everything..."
                className="flex-1 bg-transparent outline-none text-base"
                style={{ color: "var(--text-primary)" }}
              />
              <kbd className="text-xs px-2 py-1 rounded-md" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>ESC</kbd>
            </div>

            {results.length > 0 && (
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {results.map((r, i) => (
                  <button
                    key={`${r.type}-${r.title}-${i}`}
                    onClick={() => go(r.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span>{r.icon}</span>
                    <span className="flex-1 truncate">{r.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
                      {r.type}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
                No results found
              </div>
            )}

            {!query && (
              <div className="p-5 text-sm" style={{ color: "var(--text-muted)" }}>
                <p>Type to search notes, ideas, tasks, goals...</p>
                <p className="mt-1 text-xs">Or navigate with section names</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
