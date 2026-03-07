"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

export default function StatsPage() {
  const notes = useStore((s) => s.notes);
  const ideas = useStore((s) => s.ideas);
  const businessIdeas = useStore((s) => s.businessIdeas);
  const tasks = useStore((s) => s.tasks);
  const habits = useStore((s) => s.habits);
  const goals = useStore((s) => s.goals);
  const inbox = useStore((s) => s.inbox);
  const vaultNotes = useStore((s) => s.vaultNotes);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed).length;
    const activeTasks = tasks.filter((t) => !t.completed).length;
    const activeIdeas = ideas.filter((i) => !i.archived).length;
    const launchedIdeas = ideas.filter((i) => i.status === "Launched").length;
    const liveBiz = businessIdeas.filter((b) => b.stage === "Live").length;

    const today = new Date().toISOString().split("T")[0];
    const habitsCompletedToday = habits.filter((h) =>
      h.completedDates.includes(today)
    ).length;

    // Longest streak
    let longestStreak = 0;
    habits.forEach((h) => {
      const sorted = [...h.completedDates].sort().reverse();
      let streak = 0;
      const check = new Date(today);
      if (!sorted.includes(today)) check.setDate(check.getDate() - 1);
      for (let i = 0; i < 365; i++) {
        const dateStr = check.toISOString().split("T")[0];
        if (sorted.includes(dateStr)) {
          streak++;
          check.setDate(check.getDate() - 1);
        } else break;
      }
      if (streak > longestStreak) longestStreak = streak;
    });

    const avgGoalProgress = goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0;

    return {
      totalNotes: notes.length,
      activeIdeas,
      launchedIdeas,
      totalBusiness: businessIdeas.length,
      liveBiz,
      completedTasks,
      activeTasks,
      totalHabits: habits.length,
      habitsCompletedToday,
      longestStreak,
      totalGoals: goals.length,
      avgGoalProgress,
      inboxPending: inbox.filter((i) => !i.processed).length,
      vaultNotes: vaultNotes.length,
    };
  }, [notes, ideas, businessIdeas, tasks, habits, goals, inbox, vaultNotes]);

  const cards = [
    { label: "Notes Written", value: stats.totalNotes, icon: "🧠", color: "#3b82f6" },
    { label: "Active Ideas", value: stats.activeIdeas, icon: "⚡", color: "#eab308" },
    { label: "Ideas Launched", value: stats.launchedIdeas, icon: "🚀", color: "#22c55e" },
    { label: "Business Ideas", value: stats.totalBusiness, icon: "🏛️", color: "#a855f7" },
    { label: "Businesses Live", value: stats.liveBiz, icon: "💰", color: "#22c55e" },
    { label: "Tasks Completed", value: stats.completedTasks, icon: "✅", color: "#22c55e" },
    { label: "Tasks Active", value: stats.activeTasks, icon: "🔥", color: "#f97316" },
    { label: "Habits Tracked", value: stats.totalHabits, icon: "🔁", color: "#06b6d4" },
    { label: "Habits Done Today", value: `${stats.habitsCompletedToday}/${stats.totalHabits}`, icon: "📅", color: "#22c55e" },
    { label: "Longest Streak", value: `${stats.longestStreak} days`, icon: "🔥", color: "#f97316" },
    { label: "Goals Set", value: stats.totalGoals, icon: "🎯", color: "#a855f7" },
    { label: "Avg Goal Progress", value: `${stats.avgGoalProgress}%`, icon: "📈", color: "#22c55e" },
    { label: "Inbox Pending", value: stats.inboxPending, icon: "📥", color: "#eab308" },
    { label: "Vault Notes", value: stats.vaultNotes, icon: "🔒", color: "#888" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">📊 Stats</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Your MINDVAULT at a glance</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity overview */}
      <div className="mt-8 rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>Task Completion Rate</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 rounded-full overflow-hidden" style={{ background: "#222" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: "var(--accent)" }}
                initial={{ width: 0 }}
                animate={{
                  width: stats.completedTasks + stats.activeTasks > 0
                    ? `${(stats.completedTasks / (stats.completedTasks + stats.activeTasks)) * 100}%`
                    : "0%"
                }}
                transition={{ duration: 1, delay: 0.5 }} />
            </div>
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>
            {stats.completedTasks + stats.activeTasks > 0
              ? Math.round((stats.completedTasks / (stats.completedTasks + stats.activeTasks)) * 100)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}
