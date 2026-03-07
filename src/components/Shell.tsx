"use client";

import { useStore } from "@/store/useStore";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import QuickCapture from "./QuickCapture";

export default function Shell({ children }: { children: React.ReactNode }) {
  const accentColor = useStore((s) => s.accentColor);

  return (
    <div data-accent={accentColor}>
      <Sidebar />
      <CommandPalette />
      <QuickCapture />
      <main className="ml-[220px] min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
