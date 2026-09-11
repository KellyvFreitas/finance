import { formatCurrency, formatMonthKey } from "../../lib/format";

export default function ChartTooltip({ active, payload, label, extraRows = [] }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__label">{formatMonthKey(label)}</p>

            {payload.map((entry) => (
                <p className="chart-tooltip__row" key={entry.dataKey}>
                    <span
                        className="chart-tooltip__swatch"
                        style={{ background: entry.color }}
                        aria-hidden="true"
                    />
                    {entry.name}
                    <span className="chart-tooltip__value">{formatCurrency(entry.value)}</span>
                </p>
            ))}

            {extraRows.length > 0 && (
                <>
                    <div className="chart-tooltip__divider" />
                    {extraRows.map((row) => (
                        <p className="chart-tooltip__row" key={row.label}>
                            {row.label}
                            <span className="chart-tooltip__value">{row.value}</span>
                        </p>
                    ))}
                </>
            )}
        </div>
    );
}
