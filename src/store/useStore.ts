import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

// ─── Types ───────────────────────────────────────────────────
export type AccentColor = "green" | "blue" | "coral" | "purple" | "amber";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  starred: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IdeaStatus = "Raw" | "Developing" | "Shelved" | "Launched";
export interface Idea {
  id: string;
  title: string;
  description: string;
  heat: number; // 1-5
  status: IdeaStatus;
  category: string;
  color: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BusinessStage = "Concept" | "Validating" | "Building" | "Live";
export interface BusinessIdea {
  id: string;
  title: string;
  problem: string;
  audience: string;
  revenue: string;
  nextSteps: string[];
  resources: string;
  viability: number; // 1-10
  stage: BusinessStage;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = "Chill" | "Important" | "URGENT";
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string | null;
  recurring: string | null; // daily, weekly, monthly
  snoozedUntil: string | null;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  completedDates: string[]; // ISO date strings
  createdAt: string;
  color: string;
}

export interface VaultNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: "90day" | "yearly" | "life";
  progress: number; // 0-100
  milestones: { text: string; done: boolean }[];
  imageUrl: string | null;
  createdAt: string;
}

export type InboxItemType = "text" | "voice" | "photo";
export interface InboxItem {
  id: string;
  type: InboxItemType;
  content: string;
  processed: boolean;
  createdAt: string;
}

// ─── Store ───────────────────────────────────────────────────
interface AppState {
  // Settings
  accentColor: AccentColor;
  vaultPin: string | null;
  vaultUnlocked: boolean;

  // Data
  notes: Note[];
  ideas: Idea[];
  businessIdeas: BusinessIdea[];
  tasks: Task[];
  habits: Habit[];
  vaultNotes: VaultNote[];
  goals: Goal[];
  inbox: InboxItem[];

  // Settings actions
  setAccentColor: (c: AccentColor) => void;
  setVaultPin: (pin: string) => void;
  unlockVault: () => void;
  lockVault: () => void;

  // Notes
  addNote: (title: string, content: string, tags?: string[]) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Ideas
  addIdea: (title: string, description: string, category?: string) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  promoteIdeaToBusiness: (id: string) => void;

  // Business Ideas
  addBusinessIdea: (title: string) => void;
  updateBusinessIdea: (id: string, updates: Partial<BusinessIdea>) => void;
  deleteBusinessIdea: (id: string) => void;

  // Tasks
  addTask: (title: string, priority?: TaskPriority, dueDate?: string | null) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Habits
  addHabit: (name: string, frequency?: "daily" | "weekly") => void;
  toggleHabitDate: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;

  // Vault
  addVaultNote: (title: string, content: string) => void;
  updateVaultNote: (id: string, updates: Partial<VaultNote>) => void;
  deleteVaultNote: (id: string) => void;

  // Goals
  addGoal: (title: string, type: Goal["type"]) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Inbox
  addInboxItem: (content: string, type?: InboxItemType) => void;
  processInboxItem: (id: string) => void;
  deleteInboxItem: (id: string) => void;
}

const IDEA_COLORS = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#eab308", "#06b6d4"];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Settings
      accentColor: "green",
      vaultPin: null,
      vaultUnlocked: false,

      // Data
      notes: [],
      ideas: [],
      businessIdeas: [],
      tasks: [],
      habits: [],
      vaultNotes: [],
      goals: [],
      inbox: [],

      // Settings actions
      setAccentColor: (c) => set({ accentColor: c }),
      setVaultPin: (pin) => set({ vaultPin: pin }),
      unlockVault: () => set({ vaultUnlocked: true }),
      lockVault: () => set({ vaultUnlocked: false }),

      // Notes
      addNote: (title, content, tags = []) =>
        set((s) => ({
          notes: [
            {
              id: uuid(),
              title,
              content,
              tags,
              pinned: false,
              starred: false,
              archived: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.notes,
          ],
        })),
      updateNote: (id, updates) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      // Ideas
      addIdea: (title, description, category = "General") =>
        set((s) => ({
          ideas: [
            {
              id: uuid(),
              title,
              description,
              heat: 3,
              status: "Raw" as IdeaStatus,
              category,
              color: IDEA_COLORS[s.ideas.length % IDEA_COLORS.length],
              archived: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.ideas,
          ],
        })),
      updateIdea: (id, updates) =>
        set((s) => ({
          ideas: s.ideas.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
          ),
        })),
      deleteIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
      promoteIdeaToBusiness: (id) =>
        set((s) => {
          const idea = s.ideas.find((i) => i.id === id);
          if (!idea) return s;
          return {
            ideas: s.ideas.filter((i) => i.id !== id),
            businessIdeas: [
              {
                id: uuid(),
                title: idea.title,
                problem: idea.description,
                audience: "",
                revenue: "",
                nextSteps: ["", "", ""],
                resources: "",
                viability: 5,
                stage: "Concept" as BusinessStage,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              ...s.businessIdeas,
            ],
          };
        }),

      // Business Ideas
      addBusinessIdea: (title) =>
        set((s) => ({
          businessIdeas: [
            {
              id: uuid(),
              title,
              problem: "",
              audience: "",
              revenue: "",
              nextSteps: ["", "", ""],
              resources: "",
              viability: 5,
              stage: "Concept" as BusinessStage,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.businessIdeas,
          ],
        })),
      updateBusinessIdea: (id, updates) =>
        set((s) => ({
          businessIdeas: s.businessIdeas.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          ),
        })),
      deleteBusinessIdea: (id) =>
        set((s) => ({ businessIdeas: s.businessIdeas.filter((b) => b.id !== id) })),

      // Tasks
      addTask: (title, priority = "Chill", dueDate = null) =>
        set((s) => ({
          tasks: [
            {
              id: uuid(),
              title,
              completed: false,
              priority,
              dueDate,
              recurring: null,
              snoozedUntil: null,
              createdAt: new Date().toISOString(),
            },
            ...s.tasks,
          ],
        })),
      updateTask: (id, updates) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      // Habits
      addHabit: (name, frequency = "daily") =>
        set((s) => ({
          habits: [
            {
              id: uuid(),
              name,
              frequency,
              completedDates: [],
              createdAt: new Date().toISOString(),
              color: IDEA_COLORS[s.habits.length % IDEA_COLORS.length],
            },
            ...s.habits,
          ],
        })),
      toggleHabitDate: (id, date) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completedDates: h.completedDates.includes(date)
                    ? h.completedDates.filter((d) => d !== date)
                    : [...h.completedDates, date],
                }
              : h
          ),
        })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      // Vault
      addVaultNote: (title, content) =>
        set((s) => ({
          vaultNotes: [
            {
              id: uuid(),
              title,
              content,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.vaultNotes,
          ],
        })),
      updateVaultNote: (id, updates) =>
        set((s) => ({
          vaultNotes: s.vaultNotes.map((v) =>
            v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
          ),
        })),
      deleteVaultNote: (id) =>
        set((s) => ({ vaultNotes: s.vaultNotes.filter((v) => v.id !== id) })),

      // Goals
      addGoal: (title, type) =>
        set((s) => ({
          goals: [
            {
              id: uuid(),
              title,
              description: "",
              type,
              progress: 0,
              milestones: [],
              imageUrl: null,
              createdAt: new Date().toISOString(),
            },
            ...s.goals,
          ],
        })),
      updateGoal: (id, updates) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      // Inbox
      addInboxItem: (content, type = "text") =>
        set((s) => ({
          inbox: [
            {
              id: uuid(),
              type,
              content,
              processed: false,
              createdAt: new Date().toISOString(),
            },
            ...s.inbox,
          ],
        })),
      processInboxItem: (id) =>
        set((s) => ({
          inbox: s.inbox.map((i) => (i.id === id ? { ...i, processed: true } : i)),
        })),
      deleteInboxItem: (id) => set((s) => ({ inbox: s.inbox.filter((i) => i.id !== id) })),
    }),
    {
      name: "mindvault-storage",
    }
  )
);
