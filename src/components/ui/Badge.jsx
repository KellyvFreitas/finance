import clsx from "clsx";

const STATUS_VARIANTS = {
    Ativo: "good",
    "Em risco": "critical",
    "Em negociação": "warning",
    Encerrado: "neutral",
};

export function Badge({ variant = "neutral", children, className }) {
    return (
        <span className={clsx("badge", variant !== "neutral" && `badge--${variant}`, className)}>
            <span className="badge__dot" aria-hidden="true" />
            {children}
        </span>
    );
}

export function StatusBadge({ status }) {
    return <Badge variant={STATUS_VARIANTS[status] ?? "neutral"}>{status}</Badge>;
}
