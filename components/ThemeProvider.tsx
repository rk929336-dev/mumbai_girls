"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ContextValue = { theme: Theme; setTheme: (theme: Theme) => void };
const ThemeContext = createContext<ContextValue>({ theme: "system", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  useEffect(() => { const stored = localStorage.getItem("theme"); if (stored === "light" || stored === "dark" || stored === "system") setThemeState(stored); }, []);
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => { const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches); root.dataset.theme = dark ? "dark" : "light"; root.style.colorScheme = dark ? "dark" : "light"; };
    apply(); const media = window.matchMedia("(prefers-color-scheme: dark)"); media.addEventListener("change", apply); return () => media.removeEventListener("change", apply);
  }, [theme]);
  function setTheme(value: Theme) { setThemeState(value); localStorage.setItem("theme", value); }
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
