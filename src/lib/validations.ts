import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const noteSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().default(""),
  tags: z.array(z.string()).default([]),
  pinned: z.boolean().default(false),
  starred: z.boolean().default(false),
  archived: z.boolean().default(false),
});

export const ideaSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().default(""),
  heat: z.number().min(1).max(5).default(3),
  status: z.enum(["Raw", "Developing", "Shelved", "Launched"]).default("Raw"),
  category: z.string().default("General"),
  color: z.string().default("#22c55e"),
  archived: z.boolean().default(false),
});

export const businessIdeaSchema = z.object({
  title: z.string().min(1).max(500),
  problem: z.string().default(""),
  audience: z.string().default(""),
  revenue: z.string().default(""),
  nextSteps: z.array(z.string()).default(["", "", ""]),
  resources: z.string().default(""),
  viability: z.number().min(1).max(10).default(5),
  stage: z.enum(["Concept", "Validating", "Building", "Live"]).default("Concept"),
});

export const taskSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().default(""),
  priority: z.enum(["Chill", "Important", "URGENT"]).default("Chill"),
  dueDate: z.string().nullable().default(null),
  dueTime: z.string().nullable().default(null),
  recurring: z.string().nullable().default(null),
  recurrenceEnd: z.string().nullable().default(null),
  snoozedUntil: z.string().nullable().default(null),
  completed: z.boolean().default(false),
});

export const habitSchema = z.object({
  name: z.string().min(1).max(200),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
  color: z.string().default("#22c55e"),
});

export const goalSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().default(""),
  type: z.enum(["90day", "yearly", "life"]).default("90day"),
  progress: z.number().min(0).max(100).default(0),
  milestones: z.array(z.object({ text: z.string(), done: z.boolean() })).default([]),
  imageUrl: z.string().nullable().default(null),
});

export const settingsSchema = z.object({
  accentColor: z.string().optional(),
  themeMode: z.enum(["light", "dark", "system"]).optional(),
  fontSize: z.enum(["small", "normal", "large"]).optional(),
  fontFamily: z.enum(["system", "serif", "mono"]).optional(),
  spacing: z.enum(["compact", "normal", "spacious"]).optional(),
  sidebarCollapsed: z.boolean().optional(),
  dashboardLayout: z.string().optional(),
  customColors: z.string().optional(),
  vaultPin: z.string().optional(),
});

export const emailPrefsSchema = z.object({
  dailyDigest: z.boolean().optional(),
  dailyDigestTime: z.string().optional(),
  weeklyReport: z.boolean().optional(),
  taskReminders: z.boolean().optional(),
  goalReminders: z.boolean().optional(),
});
