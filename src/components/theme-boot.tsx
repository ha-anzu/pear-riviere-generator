import { useEffect } from "react";
import { applyLang, readLang, useLocale } from "@/lib/locale";
import { applyTheme, readTheme, useTheme } from "@/lib/theme";

export function ThemeBoot() {
  const setTheme = useTheme((s) => s.setTheme);
  const setLang = useLocale((s) => s.setLang);
  useEffect(() => {
    const theme = readTheme();
    applyTheme(theme);
    setTheme(theme);
    const lang = readLang();
    applyLang(lang);
    setLang(lang);
  }, [setTheme, setLang]);
  return null;
}
