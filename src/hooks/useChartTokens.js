import { useMemo } from "react";
import { useTheme } from "../app/providers/useTheme";

const TOKENS = {
    revenue: "--series-revenue",
    expense: "--series-expense",
    profit: "--series-profit",
    grid: "--chart-grid",
    axis: "--chart-axis",
    surface: "--chart-surface",
    muted: "--text-muted",
    good: "--status-good",
    critical: "--status-critical",
    accent: "--accent",
};

const LIGHT_FALLBACK = {
    revenue: "#2a78d6",
    expense: "#eb6834",
    profit: "#1baf7a",
    grid: "#e7eaf0",
    axis: "#c9cfdb",
    surface: "#ffffff",
    muted: "#78849a",
    good: "#0ca30c",
    critical: "#d03b3b",
    accent: "#2a78d6",
};

const DARK_FALLBACK = {
    ...LIGHT_FALLBACK,
    revenue: "#3987e5",
    expense: "#d95926",
    profit: "#199e70",
    grid: "#222836",
    axis: "#333b4b",
    surface: "#141821",
    accent: "#3987e5",
};

function readTokens(theme) {
    const fallback = theme === "dark" ? DARK_FALLBACK : LIGHT_FALLBACK;
    if (typeof window === "undefined") return fallback;

    const styles = getComputedStyle(document.documentElement);
    const resolved = {};

    for (const [key, variable] of Object.entries(TOKENS)) {
        resolved[key] = styles.getPropertyValue(variable).trim() || fallback[key];
    }

    return resolved;
}

export function useChartTokens() {
    const { resolvedTheme } = useTheme();

    return useMemo(() => readTokens(resolvedTheme), [resolvedTheme]);
}
