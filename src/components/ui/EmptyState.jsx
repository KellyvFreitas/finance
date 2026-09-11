import { SearchX } from "lucide-react";

export default function EmptyState({
    icon: Icon = SearchX,
    title = "Nenhum resultado",
    description = "Ajuste os filtros ou tente outro termo de busca.",
    action,
}) {
    return (
        <div className="empty">
            <div className="empty__icon">
                <Icon size={20} aria-hidden="true" />
            </div>
            <p className="empty__title">{title}</p>
            <p className="empty__text">{description}</p>
            {action}
        </div>
    );
}
