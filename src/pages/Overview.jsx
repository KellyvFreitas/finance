import { useState } from "react";
import { Banknote, Percent, TrendingDown, Wallet } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import KpiCard, { KpiCardSkeleton } from "../components/dashboard/KpiCard";
import TopContracts from "../components/dashboard/TopContracts";
import RevenueExpenseChart from "../components/charts/RevenueExpenseChart";
import ProfitChart from "../components/charts/ProfitChart";
import CategoryBars from "../components/charts/CategoryBars";
import TransactionsTable from "../components/tables/TransactionsTable";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { useFinanceData } from "../hooks/useFinanceData";
import { useChartTokens } from "../hooks/useChartTokens";
import { PERIOD_OPTIONS } from "../lib/dataset";
import { formatCurrency, formatMonthKey, formatPercent } from "../lib/format";

function ChartSkeleton({ height = 300 }) {
    return (
        <Card flush>
            <div style={{ padding: "20px" }}>
                <Skeleton width={180} height={16} />
                <Skeleton width={120} height={12} style={{ marginTop: 8 }} />
                <Skeleton
                    width="100%"
                    height={height}
                    radius="10px"
                    style={{ marginTop: 20 }}
                />
            </div>
        </Card>
    );
}

export default function Overview() {
    const [months, setMonths] = useState(12);
    const tokens = useChartTokens();
    const { data, loading, error } = useFinanceData({ months });

    const periodFilter = (
        <SegmentedControl
            options={PERIOD_OPTIONS}
            value={months}
            onChange={setMonths}
            label="Período de análise"
        />
    );

    if (error) {
        return (
            <>
                <PageHeader title="Visão geral" actions={periodFilter} />
                <Card>
                    <p className="text-muted">
                        Não foi possível carregar os dados do servidor. Verifique se o backend
                        está rodando em {import.meta.env.VITE_API_URL ?? "http://localhost:3001"}.
                    </p>
                </Card>
            </>
        );
    }

    const rangeLabel = data
        ? `${formatMonthKey(data.months[0])} – ${formatMonthKey(data.months.at(-1))}`
        : "";

    return (
        <>
            <PageHeader
                title="Visão geral"
                subtitle={
                    data ? `Consolidado de ${data.contractRows.length} contratos · ${rangeLabel}` : ""
                }
                actions={periodFilter}
            />

            {loading || !data ? (
                <>
                    <div className="grid-kpis">
                        {Array.from({ length: 4 }, (_, index) => (
                            <KpiCardSkeleton key={index} />
                        ))}
                    </div>
                    <div className="grid-charts">
                        <ChartSkeleton />
                        <ChartSkeleton height={240} />
                    </div>
                </>
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

                    <div className="grid-split">
                        <ProfitChart data={data.series} subtitle={rangeLabel} />
                        <TopContracts rows={data.contractRows} subtitle={rangeLabel} />
                    </div>

                    <TransactionsTable
                        rows={data.rows}
                        title="Lançamentos recentes"
                        subtitle="Últimos movimentos registrados no período"
                        showFilters={false}
                        pageSize={6}
                    />
                </>
            )}
        </>
    );
}
