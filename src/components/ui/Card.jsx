import clsx from "clsx";

export default function Card({
    title,
    subtitle,
    actions,
    flush = false,
    className,
    headerId,
    children,
}) {
    const hasHeader = Boolean(title || subtitle || actions);

    return (
        <section className={clsx("card", className)}>
            {hasHeader && (
                <header className="card__header">
                    <div className="card__heading">
                        {title && (
                            <h2 className="card__title" id={headerId}>
                                {title}
                            </h2>
                        )}
                        {subtitle && <p className="card__subtitle">{subtitle}</p>}
                    </div>
                    {actions && <div className="chart-card__toolbar">{actions}</div>}
                </header>
            )}

            <div className={clsx("card__body", flush && "card__body--flush")}>{children}</div>
        </section>
    );
}
