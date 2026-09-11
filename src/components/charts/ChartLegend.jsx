export default function ChartLegend({ items }) {
    return (
        <div className="chart-legend">
            {items.map((item) => (
                <span className="chart-legend__item" key={item.label}>
                    <span
                        className={
                            item.shape === "line"
                                ? "chart-legend__swatch chart-legend__swatch--line"
                                : "chart-legend__swatch"
                        }
                        style={{ background: item.color }}
                        aria-hidden="true"
                    />
                    {item.label}
                </span>
            ))}
        </div>
    );
}
