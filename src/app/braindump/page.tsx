"use client";

import { useState } from "react";
import { useStore, Note } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export default function BrainDumpPage() {
  const notes = useStore((s) => s.notes);
  const addNote = useStore((s) => s.addNote);
  const updateNote = useStore((s) => s.updateNote);
  const deleteNote = useStore((s) => s.deleteNote);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [editing, setEditing] = useState<Note | null>(null);
  const [filter, setFilter] = useState<"all" | "pinned" | "starred">("all");

  const visible = notes.filter((n) => {
    if (n.archived) return false;
    if (filter === "pinned") return n.pinned;
    if (filter === "starred") return n.starred;
    return true;
  });

  const sorted = [...visible].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const submit = () => {
    if (!title.trim()) return;
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (editing) {
      updateNote(editing.id, { title, content, tags });
      setEditing(null);
    } else {
      addNote(title, content, tags);
    }
    setTitle("");
    setContent("");
    setTagInput("");
    setShowForm(false);
  };

  const startEdit = (n: Note) => {
    setEditing(n);
    setTitle(n.title);
    setContent(n.content);
    setTagInput(n.tags.join(", "));
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">🧠 Brain Dump</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {notes.filter((n) => !n.archived).length} notes
          </p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setTitle(""); setContent(""); setTagInput(""); }}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: "var(--accent)", color: "#000" }}>
          + New Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "pinned", "starred"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all capitalize"
            style={{
              background: filter === f ? "var(--accent-glow)" : "var(--bg-card)",
              color: filter === f ? "var(--accent)" : "var(--text-secondary)",
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
            }}>
            {f === "pinned" ? "📌 Pinned" : f === "starred" ? "⭐ Starred" : "All"}
          </button>
        ))}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">{editing ? "Edit Note" : "New Note"}</h3>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
                className="w-full rounded-xl p-3 mb-3 text-sm outline-none"
                style={{ background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)" }} />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your thoughts..."
                className="w-full rounded-xl p-3 mb-3 text-sm outline-none resize-none"
                style={{ background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)", minHeight: "150px" }} />
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Tags (comma separated)"
                className="w-full rounded-xl p-3 mb-4 text-sm outline-none"
                style={{ background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)" }} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-sm" style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Cancel</button>
                <button onClick={submit}
                  className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--accent)", color: "#000" }}>
                  {editing ? "Save" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {sorted.map((note) => (
            <motion.div key={note.id} layout
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl p-5 cursor-pointer group"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              onClick={() => startEdit(note)}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm truncate flex-1">{note.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); updateNote(note.id, { pinned: !note.pinned }); }}
                    className="text-xs p-1 rounded" style={{ color: note.pinned ? "var(--accent)" : "var(--text-muted)" }}>📌</button>
                  <button onClick={(e) => { e.stopPropagation(); updateNote(note.id, { starred: !note.starred }); }}
                    className="text-xs p-1 rounded" style={{ color: note.starred ? "#eab308" : "var(--text-muted)" }}>⭐</button>
                  <button onClick={(e) => { e.stopPropagation(); updateNote(note.id, { archived: true }); }}
                    className="text-xs p-1 rounded" style={{ color: "var(--text-muted)" }}>📦</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="text-xs p-1 rounded" style={{ color: "#ef4444" }}>✕</button>
                </div>
              </div>
              <p className="text-xs line-clamp-3 mb-3" style={{ color: "var(--text-secondary)" }}>{note.content}</p>
              <div className="flex gap-1 flex-wrap">
                {note.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md"
                    style={{ background: "var(--bg-primary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && (
        <div className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-4xl mb-3">🧠</p>
          <p className="font-medium" style={{ color: "var(--text-secondary)" }}>No notes yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Start dumping your brain</p>
        </div>
      )}
    </div>
  );
}
