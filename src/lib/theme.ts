import { create } from "zustand";

export type ThemeId = "atelier" | "cyber";

const KEY = "pear-riviere-theme";

export function readTheme(): ThemeId {
  if (typeof window === "undefined") return "atelier";
  try {
    return window.localStorage.getItem(KEY) === "cyber" ? "cyber" : "atelier";
  } catch {
    return "atelier";
  }
}

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    /* private mode */
  }
}

type ThemeState = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggle: () => void;
};

export const useTheme = create<ThemeState>((set, get) => ({
  theme: "atelier",
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggle: () => {
    const theme = get().theme === "cyber" ? "atelier" : "cyber";
    applyTheme(theme);
    set({ theme });
  },
}));
