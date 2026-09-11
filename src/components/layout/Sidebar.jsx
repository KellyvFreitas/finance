import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { ChartNoAxesCombined } from "lucide-react";
import { NAV_ITEMS } from "./navigation";

export default function Sidebar({ collapsed, open, onNavigate }) {
    return (
        <aside
            id="app-sidebar"
            className={clsx(
                "sidebar",
                collapsed && "sidebar--collapsed",
                open && "sidebar--open",
            )}
        >
            <div className="sidebar__brand">
                <span className="sidebar__logo" aria-hidden="true">
                    <ChartNoAxesCombined size={18} />
                </span>
                {!collapsed && (
                    <span className="sidebar__brand-text">
                        <span className="sidebar__brand-name">Finance Dashboard</span>
                        <span className="sidebar__brand-sub">Gestão de contratos</span>
                    </span>
                )}
            </div>

            <nav className="sidebar__nav" aria-label="Navegação principal">
                <span className="sidebar__section-label">Análise</span>

                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onNavigate}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                            clsx("nav-item", isActive && "nav-item--active")
                        }
                    >
                        <item.icon size={18} className="nav-item__icon" aria-hidden="true" />
                        <span className="nav-item__label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__footer">
                <span className="avatar" aria-hidden="true">
                    BV
                </span>
                {!collapsed && (
                    <span className="sidebar__user">
                        <span className="sidebar__user-name">Bernardo Vieira</span>
                        <span className="sidebar__user-role">Controladoria</span>
                    </span>
                )}
            </div>
        </aside>
    );
}
