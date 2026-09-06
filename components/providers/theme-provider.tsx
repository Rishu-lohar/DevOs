"use client";

import * as React from "react";

type Theme = "dark" | "light";

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}>({ theme: "dark", setTheme: () => {}, toggle: () => {} });

export function useTheme() {
  return React.useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark");

  React.useEffect(() => {
    const stored = window.localStorage.getItem("devos-theme") as Theme | null;
    if (stored === "light" || stored === "dark") setThemeState(stored);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    window.localStorage.setItem("devos-theme", theme);
  }, [theme]);

  const setTheme = React.useCallback((t: Theme) => setThemeState(t), []);
  const toggle = React.useCallback(
    () => setThemeState((p) => (p === "dark" ? "light" : "dark")),
    [],
  );

  const value = React.useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
