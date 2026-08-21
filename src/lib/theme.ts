import { create } from "zustand";

export type ThemeId = "black" | "white";

const KEY = "riviere-theme";

export function readTheme(): ThemeId {
  if (typeof window === "undefined") return "black";
  try {
    const value = window.localStorage.getItem(KEY);
    if (value === "white") return "white";
    if (value === "black" || value === "cyber" || value === "atelier") return "black";
    return "black";
  } catch {
    return "black";
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
};

export const useTheme = create<ThemeState>((set) => ({
  theme: "black",
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
