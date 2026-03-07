"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

const NAV = [
  { href: "/", icon: "📥", label: "Inbox" },
  { href: "/braindump", icon: "🧠", label: "Brain Dump" },
  { href: "/spark", icon: "⚡", label: "Spark" },
  { href: "/empire", icon: "🏛️", label: "Empire" },
  { href: "/firelist", icon: "🔥", label: "Fire List" },
  { href: "/rituals", icon: "🔁", label: "Rituals" },
  { href: "/goals", icon: "🎯", label: "Goals" },
  { href: "/vault", icon: "🔒", label: "Vault" },
  { href: "/stats", icon: "📊", label: "Stats" },
];

const ACCENTS = [
  { key: "green" as const, color: "#22c55e" },
  { key: "blue" as const, color: "#3b82f6" },
  { key: "coral" as const, color: "#f97316" },
  { key: "purple" as const, color: "#a855f7" },
  { key: "amber" as const, color: "#eab308" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const accentColor = useStore((s) => s.accentColor);
  const setAccentColor = useStore((s) => s.setAccentColor);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col py-6 px-3 border-r z-50"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      {/* Logo */}
      <div className="px-3 mb-8">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
          MINDVAULT
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Your personal command center</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline"
              style={{
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--accent-glow)" : "transparent",
              }}>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ background: "var(--accent)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Accent picker */}
      <div className="px-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Theme</p>
        <div className="flex gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAccentColor(a.key)}
              className="w-5 h-5 rounded-full transition-transform hover:scale-110"
              style={{
                background: a.color,
                outline: accentColor === a.key ? `2px solid ${a.color}` : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
