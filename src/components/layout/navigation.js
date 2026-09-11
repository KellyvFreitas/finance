import { ArrowLeftRight, FileText, LayoutDashboard } from "lucide-react";

export const NAV_ITEMS = [
    { to: "/", label: "Visão geral", icon: LayoutDashboard, end: true },
    { to: "/contratos", label: "Contratos", icon: FileText },
    { to: "/transacoes", label: "Transações", icon: ArrowLeftRight },
];
