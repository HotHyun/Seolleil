"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const storageKey = "korean-ski-theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

// Theme lives in localStorage (external store). The in-memory override keeps the
// toggle working when storage is unavailable.
let themeOverride: Theme | null = null;
const themeListeners = new Set<() => void>();

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readTheme(): Theme {
  if (themeOverride) return themeOverride;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === "dark" || stored === "light" ? stored : "light";
  } catch {
    return "light";
  }
}

function writeTheme(theme: Theme) {
  themeOverride = theme;
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {}
  applyTheme(theme);
  themeListeners.forEach(listener => listener());
}

function useTheme() {
  const theme = React.useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => "light");
  React.useEffect(() => applyTheme(theme), [theme]);
  return [theme, () => writeTheme(theme === "dark" ? "light" : "dark")] as const;
}

export function ThemeToggle() {
  const [theme, toggleTheme] = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={theme === "dark" ? "라이트모드로 전환" : "다크모드로 전환"}
      title={theme === "dark" ? "라이트모드" : "다크모드"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function ThemeMenuItem({ className }: { className?: string }) {
  const [theme, toggleTheme] = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition hover:bg-muted focus:bg-muted",
        className
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {theme === "dark" ? "라이트모드로 전환" : "다크모드로 전환"}
    </button>
  );
}
