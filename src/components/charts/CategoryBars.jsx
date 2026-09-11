import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCurrency, formatPercent } from "../../lib/format";

export default function CategoryBars({ data, subtitle }) {
    const max = Math.max(...data.map((row) => row.value), 0);

    return (
        <Card title="Despesas por categoria" subtitle={subtitle} flush>
            {data.length === 0 ? (
                <EmptyState
                    title="Sem despesas no período"
                    description="Nenhum lançamento de despesa foi encontrado para os filtros atuais."
                />
            ) : (
                <ul className="cat-bars">
                    {data.map((row) => (
                        <li key={row.category}>
                            <div className="cat-bar__head">
                                <span className="cat-bar__name">{row.category}</span>
                                <span className="cat-bar__value">{formatCurrency(row.value)}</span>
                            </div>

                            <div
                                className="cat-bar__track"
                                role="img"
                                aria-label={`${row.category}: ${formatCurrency(row.value)}, ${formatPercent(row.share)} do total`}
                            >
                                <div
                                    className="cat-bar__fill"
                                    style={{ width: `${max ? (row.value / max) * 100 : 0}%` }}
                                />
                            </div>

                            <p className="cat-bar__share">{formatPercent(row.share)} do total</p>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
