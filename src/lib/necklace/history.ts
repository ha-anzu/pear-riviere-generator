import type { SavedConfig } from "./engine";

const KEY = "pear-riviere-history-v1";
const LAST_KEY = "pear-riviere-last-v1";
const MAX = 30;

export type LocalProject = {
  id: string;
  name: string;
  notes: string;
  created: string;
  config: SavedConfig;
};

export function newProjectId(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  const r = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PR-${t}${r}`;
}

export function loadHistory(): LocalProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalProject[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: LocalProject): LocalProject[] {
  const next = [item, ...loadHistory().filter((h) => h.id !== item.id)].slice(
    0,
    MAX,
  );
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}

export function deleteHistoryItem(id: string): LocalProject[] {
  const next = loadHistory().filter((h) => h.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}

export function loadLastConfig(): SavedConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedConfig;
  } catch {
    return null;
  }
}

export function persistLastConfig(cfg: SavedConfig) {
  try {
    window.localStorage.setItem(LAST_KEY, JSON.stringify(cfg));
  } catch {
    /* quota */
  }
}
