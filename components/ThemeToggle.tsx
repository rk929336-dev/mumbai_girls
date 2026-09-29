"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
  const label = theme === "system" ? "System theme" : theme === "dark" ? "Dark theme" : "Light theme";
  return <button type="button" onClick={() => setTheme(next)} aria-label={`${label}. Change to ${next} theme.`} title={`${label} · click to switch`} className="min-h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[12px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-raised)]">{theme === "system" ? "◐ System" : theme === "dark" ? "☾ Dark" : "☀ Light"}</button>;
}
