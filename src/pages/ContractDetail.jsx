import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Banknote, ChevronRight, Percent, TrendingDown, Wallet } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import Card from "../components/ui/Card";
import { StatusBadge } from "../components/ui/Badge";
import KpiCard from "../components/dashboard/KpiCard";
import RevenueExpenseChart from "../components/charts/RevenueExpenseChart";
import ProfitChart from "../components/charts/ProfitChart";
import CategoryBars from "../components/charts/CategoryBars";
import TransactionsTable from "../components/tables/TransactionsTable";
import NotFound from "./NotFound";
import { useFinanceData } from "../hooks/useFinanceData";
import { useChartTokens } from "../hooks/useChartTokens";
import { useContracts } from "../app/providers/useContracts";
import { PERIOD_OPTIONS } from "../lib/dataset";
import {
    formatCurrency,
    formatDate,
    formatMonthKey,
    formatPercent,
} from "../lib/format";

function Definition({ term, children }) {
    return (
        <div>
            <dt className="def-list__term">{term}</dt>
            <dd className="def-list__desc" style={{ margin: 0 }}>
                {children}
            </dd>
        </div>
    );
}

export default function ContractDetail() {
    const { id } = useParams();
    const [months, setMonths] = useState(12);

    const { contractsById, loading: contractsLoading } = useContracts();
    const contract = contractsById.get(Number(id));
    const tokens = useChartTokens();
    const { data, loading, error } = useFinanceData({
        months,
        contractId: contract?.id ?? null,
    });

    if (contractsLoading) return null;
    if (!contract) return <NotFound />;

    if (error) {
        return (
            <Card>
                <p className="text-muted">Não foi possível carregar os dados do servidor.</p>
            </Card>
        );
    }

    if (loading || !data) return null;

    const rangeLabel = `${formatMonthKey(data.months[0])} – ${formatMonthKey(
        data.months.at(-1),
    )}`;

    return (
        <>
            <PageHeader
                title={contract.name}
                subtitle={`${contract.client} · ${contract.code}`}
                breadcrumb={
                    <span className="breadcrumb">
                        <Link to="/contratos">Contratos</Link>
                        <ChevronRight size={13} aria-hidden="true" />
                        <span>{contract.name}</span>
                    </span>
                }
                actions={
                    <>
                        <StatusBadge status={contract.status} />
                        <SegmentedControl
                            options={PERIOD_OPTIONS}
                            value={months}
                            onChange={setMonths}
                            label="Período de análise"
                        />
                    </>
                }
            />

            <div className="stack">
                <Card flush>
                    <dl className="def-list">
                        <Definition term="Cliente">{contract.client}</Definition>
                        <Definition term="Segmento">{contract.segment}</Definition>
                        <Definition term="Responsável">{contract.manager}</Definition>
                        <Definition term="Início">{formatDate(contract.startDate)}</Definition>
                        <Definition term="Vigência até">
                            {formatDate(contract.endDate)}
                        </Definition>
                        <Definition term="Valor do contrato">
                            {formatCurrency(contract.totalValue)}
                        </Definition>
                        <Definition term="Mensalidade">
                            {formatCurrency(contract.mrr)}
                        </Definition>
                        <Definition term="Índice de saúde">
                            {contract.healthScore}/100
                        </Definition>
                    </dl>
                </Card>

                {data.rows.length === 0 ? (
                    <Card>
                        <p className="text-muted">
                            Este contrato não possui lançamentos no período selecionado.
                        </p>
                    </Card>
                ) : (
                    <>
                        <div className="grid-kpis">
                            <KpiCard
                                label="Receita"
                                value={formatCurrency(data.summary.revenue)}
                                delta={data.deltas.revenue}
                                icon={Banknote}
                                sparkData={data.sparks.revenue}
                                sparkColor={tokens.revenue}
                            />
                            <KpiCard
                                label="Despesas"
                                value={formatCurrency(data.summary.expenses)}
                                delta={data.deltas.expenses}
                                higherIsBetter={false}
                                icon={TrendingDown}
                                sparkData={data.sparks.expenses}
                                sparkColor={tokens.expense}
                            />
                            <KpiCard
                                label="Resultado"
                                value={formatCurrency(data.summary.profit)}
                                numericValue={data.summary.profit}
                                delta={data.deltas.profit}
                                icon={Wallet}
                                sparkData={data.sparks.profit}
                                sparkColor={tokens.profit}
                            />
                            <KpiCard
                                label="Margem líquida"
                                value={formatPercent(data.summary.margin)}
                                numericValue={data.summary.margin}
                                delta={data.deltas.margin}
                                deltaUnit="p.p."
                                icon={Percent}
                                sparkData={data.sparks.margin}
                                sparkColor={tokens.profit}
                            />
                        </div>

                        <div className="grid-charts">
                            <RevenueExpenseChart data={data.series} subtitle={rangeLabel} />
                            <CategoryBars
                                data={data.categories}
                                subtitle={`Total de ${formatCurrency(data.summary.expenses)}`}
                            />
                        </div>

                        <ProfitChart data={data.series} subtitle={rangeLabel} />

                        <TransactionsTable
                            rows={data.rows}
                            subtitle={`Lançamentos de ${contract.name}`}
                            showContract={false}
                            pageSize={8}
                        />
                    </>
                )}
            </div>
        </>
    );
}
