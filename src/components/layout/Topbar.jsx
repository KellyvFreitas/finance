import { Moon, PanelLeft, Sun } from "lucide-react";
import Button from "../ui/Button";
import { useTheme } from "../../app/providers/useTheme";

export default function Topbar({ title, onToggleSidebar, sidebarExpanded }) {
    const { resolvedTheme, toggleTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <header className="topbar">
            <Button
                variant="ghost"
                iconOnly
                icon={PanelLeft}
                onClick={onToggleSidebar}
                aria-label={sidebarExpanded ? "Recolher menu" : "Expandir menu"}
                aria-expanded={sidebarExpanded}
                aria-controls="app-sidebar"
            />

            <span className="topbar__title">{title}</span>

            <div className="topbar__actions">
                <Button
                    variant="ghost"
                    iconOnly
                    icon={isDark ? Sun : Moon}
                    onClick={toggleTheme}
                    aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
                    title={isDark ? "Tema claro" : "Tema escuro"}
                />
            </div>
        </header>
    );
}
