import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "finance-dashboard:theme";

const systemPrefersDark = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

function readStoredTheme() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        // Private mode / blocked storage — fall through to the system setting.
    }
    return null;
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Persisting is a nicety; the app works without it.
    }
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(
        () => readStoredTheme() ?? (systemPrefersDark() ? "dark" : "light"),
    );
    const themeRef = useRef(theme);

    const setTheme = useCallback((next) => {
        const value = typeof next === "function" ? next(themeRef.current) : next;

        themeRef.current = value;
        applyTheme(value);
        setThemeState(value);
    }, []);

    const toggleTheme = useCallback(
        () => setTheme(themeRef.current === "dark" ? "light" : "dark"),
        [setTheme],
    );

    useEffect(() => {
        applyTheme(themeRef.current);
    }, []);

    useEffect(() => {
        if (readStoredTheme()) return undefined;

        const query = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (event) => setTheme(event.matches ? "dark" : "light");

        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, [setTheme]);

    const value = useMemo(
        () => ({ theme, resolvedTheme: theme, setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
