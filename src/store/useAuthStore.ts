"use client";

import { create } from "zustand";

export interface UserSettings {
  id: string;
  accentColor: string;
  themeMode: string;
  fontSize: string;
  fontFamily: string;
  spacing: string;
  sidebarCollapsed: boolean;
  dashboardLayout: string | null;
  customColors: string | null;
  vaultPin: string | null;
}

export interface EmailPrefs {
  dailyDigest: boolean;
  dailyDigestTime: string;
  weeklyReport: boolean;
  taskReminders: boolean;
  goalReminders: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  settings: UserSettings | null;
  emailPrefs: EmailPrefs | null;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<{ error?: string }>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateEmailPrefs: (prefs: Partial<EmailPrefs>) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Login failed" };
      set({ user: data.user, isAuthenticated: true });
      return {};
    } catch {
      return { error: "Network error" };
    }
  },

  signup: async (email, password, name) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Signup failed" };
      set({ user: data.user, isAuthenticated: true });
      return {};
    } catch {
      return { error: "Network error" };
    }
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) return { error: result.error };
      const user = get().user;
      if (user) {
        set({ user: { ...user, ...result } });
      }
      return {};
    } catch {
      return { error: "Network error" };
    }
  },

  updateSettings: async (settings) => {
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = await res.json();
      const user = get().user;
      if (user) {
        set({ user: { ...user, settings: result } });
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  },

  updateEmailPrefs: async (prefs) => {
    try {
      // We'd need an email prefs endpoint — reusing settings for now
      const user = get().user;
      if (user) {
        set({ user: { ...user, emailPrefs: { ...user.emailPrefs, ...prefs } as EmailPrefs } });
      }
    } catch (err) {
      console.error("Failed to update email prefs:", err);
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
