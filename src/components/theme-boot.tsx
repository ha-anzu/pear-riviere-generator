import { useEffect } from "react";
import { applyTheme, readTheme, useTheme } from "@/lib/theme";

export function ThemeBoot() {
  const setTheme = useTheme((s) => s.setTheme);
  useEffect(() => {
    const theme = readTheme();
    applyTheme(theme);
    setTheme(theme);
  }, [setTheme]);
  return null;
}
