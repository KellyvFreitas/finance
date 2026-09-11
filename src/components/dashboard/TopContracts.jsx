import { Link } from "react-router-dom";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCurrency, formatPercent } from "../../lib/format";

export default function TopContracts({ rows, subtitle, limit = 5 }) {
    const ranked = [...rows].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
    const max = Math.max(...ranked.map((row) => row.revenue), 0);

    return (
        <Card title="Contratos por receita" subtitle={subtitle} flush>
            {ranked.length === 0 ? (
                <EmptyState
                    title="Sem receita no período"
                    description="Nenhum contrato registrou faturamento na janela selecionada."
                />
            ) : (
                <ul className="cat-bars">
                    {ranked.map(({ contract, revenue, margin }) => (
                        <li key={contract.id}>
                            <div className="cat-bar__head">
                                <Link to={`/contratos/${contract.id}`} className="cat-bar__name">
                                    {contract.name}
                                </Link>
                                <span className="cat-bar__value">{formatCurrency(revenue)}</span>
                            </div>

                            <div className="cat-bar__track">
                                <div
                                    className="cat-bar__fill"
                                    style={{
                                        width: `${max ? (revenue / max) * 100 : 0}%`,
                                        background: "var(--series-revenue)",
                                    }}
                                />
                            </div>

                            <p className="cat-bar__share">
                                {contract.client} · margem {formatPercent(margin)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
