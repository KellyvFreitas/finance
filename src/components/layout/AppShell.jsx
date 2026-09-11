import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { NAV_ITEMS } from "./navigation";
import { useMediaQuery } from "../../hooks/useMediaQuery";

function titleFor(pathname) {
    if (pathname.startsWith("/contratos/")) return "Detalhe do contrato";

    const match = NAV_ITEMS.find((item) =>
        item.end ? item.to === pathname : pathname.startsWith(item.to),
    );

    return match?.label ?? "Finance Dashboard";
}

export default function AppShell() {
    const { pathname } = useLocation();
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const [collapsed, setCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [lastPathname, setLastPathname] = useState(pathname);

    if (pathname !== lastPathname) {
        setLastPathname(pathname);
        setDrawerOpen(false);
    }

    const toggleSidebar = () =>
        isDesktop ? setCollapsed((value) => !value) : setDrawerOpen((value) => !value);

    useEffect(() => {
        if (!drawerOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") setDrawerOpen(false);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [drawerOpen]);

    return (
        <div className="shell">
            <Sidebar
                collapsed={isDesktop && collapsed}
                open={drawerOpen}
                onNavigate={() => setDrawerOpen(false)}
            />

            {drawerOpen && !isDesktop && (
                <button
                    type="button"
                    className="scrim"
                    aria-label="Fechar menu"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            <div className="shell__main">
                <Topbar
                    title={titleFor(pathname)}
                    onToggleSidebar={toggleSidebar}
                    sidebarExpanded={isDesktop ? !collapsed : drawerOpen}
                />

                <main className="shell__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
