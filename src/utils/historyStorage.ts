import { TimerMode } from "@/components/ModeSelector";

export type TimerHistoryEntry = {
  id: string;
  title: string;
  mode: TimerMode;
  durationMinutes: number;
  createdAt: string;
  notes?: string;
};

const STORAGE_KEY = "pomodoro-history";

export const loadHistory = (): TimerHistoryEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as TimerHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const saveHistory = (history: TimerHistoryEntry[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history", error);
  }
};
