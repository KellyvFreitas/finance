import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import ContractsTable from "../components/tables/ContractsTable";
import TopContracts from "../components/dashboard/TopContracts";
import CategoryBars from "../components/charts/CategoryBars";
import { useFinanceData } from "../hooks/useFinanceData";
import { PERIOD_OPTIONS } from "../lib/dataset";
import { formatCurrency, formatMonthKey } from "../lib/format";

export default function Contracts() {
    const [months, setMonths] = useState(12);
    const data = useFinanceData({ months });

    const rangeLabel = `${formatMonthKey(data.months[0])} – ${formatMonthKey(
        data.months.at(-1),
    )}`;

    return (
        <>
            <PageHeader
                title="Contratos"
                subtitle={`Receita e resultado por contrato · ${rangeLabel}`}
                actions={
                    <SegmentedControl
                        options={PERIOD_OPTIONS}
                        value={months}
                        onChange={setMonths}
                        label="Período de análise"
                    />
                }
            />

            <div className="stack">
                <ContractsTable
                    rows={data.contractRows}
                    subtitle="Selecione um contrato para ver o detalhamento"
                />

                <div className="grid-split">
                    <TopContracts rows={data.contractRows} subtitle={rangeLabel} limit={6} />
                    <CategoryBars
                        data={data.categories}
                        subtitle={`Total de ${formatCurrency(data.summary.expenses)}`}
                    />
                </div>
            </div>
        </>
    );
}
