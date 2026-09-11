import { useMemo } from "react";
import {
    categoryBreakdown,
    contracts,
    filterTransactions,
    getPeriod,
    monthlySeries,
    summarize,
    transactions,
} from "../lib/dataset";
import { percentChange } from "../lib/format";

export function useFinanceData({ months, contractId = null }) {
    return useMemo(() => {
        const { current, previous } = getPeriod(months);
        const scope = contractId ? { contractId } : {};

        const currentRows = filterTransactions(transactions, { ...scope, months });
        const previousMonths = new Set(previous);
        const previousRows = filterTransactions(transactions, scope).filter((row) =>
            previousMonths.has(row.monthKey),
        );

        const summary = summarize(currentRows);
        const previousSummary = summarize(previousRows);
        const series = monthlySeries(currentRows, current);

        const monthsCovered = (rows) => new Set(rows.map((row) => row.monthKey)).size;
        const comparable =
            monthsCovered(currentRows) === months && monthsCovered(previousRows) === months;

        const deltas = comparable
            ? {
                  revenue: percentChange(summary.revenue, previousSummary.revenue),
                  expenses: percentChange(summary.expenses, previousSummary.expenses),
                  profit: percentChange(summary.profit, previousSummary.profit),
                  margin: previousSummary.margin
                      ? summary.margin - previousSummary.margin
                      : null,
              }
            : { revenue: null, expenses: null, profit: null, margin: null };

        const contractRows = contracts
            .map((contract) => {
                const rows = currentRows.filter((row) => row.contractId === contract.id);
                const totals = summarize(rows);

                return {
                    contract,
                    revenue: totals.revenue,
                    expenses: totals.expenses,
                    result: totals.profit,
                    margin: totals.margin,
                };
            })
            .filter((row) => row.revenue > 0 || row.expenses > 0);

        return {
            months: current,
            comparable,
            rows: currentRows,
            summary,
            previousSummary,
            deltas,
            series,
            categories: categoryBreakdown(currentRows),
            contractRows,
            sparks: {
                revenue: series.map((row) => ({ value: row.receita })),
                expenses: series.map((row) => ({ value: row.despesa })),
                profit: series.map((row) => ({ value: row.lucro })),
                margin: series.map((row) => ({
                    value: row.receita ? (row.lucro / row.receita) * 100 : 0,
                })),
            },
        };
    }, [months, contractId]);
}
