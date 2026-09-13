import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import TransactionsTable from "../components/tables/TransactionsTable";
import Card from "../components/ui/Card";
import { useFinanceData } from "../hooks/useFinanceData";
import { PERIOD_OPTIONS } from "../lib/dataset";
import { formatCurrency, formatMonthKey } from "../lib/format";

export default function Transactions() {
    const [months, setMonths] = useState(6);
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
                <PageHeader title="Transações" actions={periodFilter} />
                <Card>
                    <p className="text-muted">Não foi possível carregar os dados do servidor.</p>
                </Card>
            </>
        );
    }

    if (loading || !data) {
        return (
            <>
                <PageHeader title="Transações" actions={periodFilter} />
            </>
        );
    }

    const rangeLabel = `${formatMonthKey(data.months[0])} – ${formatMonthKey(
        data.months.at(-1),
    )}`;

    return (
        <>
            <PageHeader
                title="Transações"
                subtitle={`${data.rows.length} lançamentos · entradas de ${formatCurrency(
                    data.summary.revenue,
                )} e saídas de ${formatCurrency(data.summary.expenses)}`}
                actions={periodFilter}
            />

            <TransactionsTable rows={data.rows} subtitle={rangeLabel} pageSize={12} />
        </>
    );
}
