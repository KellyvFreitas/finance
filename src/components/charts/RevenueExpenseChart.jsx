import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Card from "../ui/Card";
import ChartLegend from "./ChartLegend";
import ChartTooltip from "./ChartTooltip";
import ChartDataTable from "./ChartDataTable";
import { useChartView } from "./useChartView";
import { useChartTokens } from "../../hooks/useChartTokens";
import { formatCompactCurrency, formatCurrency, formatMonthKey } from "../../lib/format";

export default function RevenueExpenseChart({ data, subtitle }) {
    const tokens = useChartTokens();
    const { view, toggle } = useChartView();

    const legend = [
        { label: "Receita", color: tokens.revenue, shape: "line" },
        { label: "Despesas", color: tokens.expense, shape: "line" },
    ];

    return (
        <Card title="Receita vs. despesas" subtitle={subtitle} actions={toggle} flush>
            {view === "chart" ? (
                <>
                    <ChartLegend items={legend} />

                    <div className="chart-frame">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 12, right: 16, bottom: 0, left: 0 }}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke={tokens.grid}
                                    strokeWidth={1}
                                />

                                <XAxis
                                    dataKey="monthKey"
                                    tickFormatter={formatMonthKey}
                                    tickLine={false}
                                    axisLine={{ stroke: tokens.axis }}
                                    tickMargin={10}
                                    minTickGap={8}
                                />

                                <YAxis
                                    tickFormatter={formatCompactCurrency}
                                    tickLine={false}
                                    axisLine={false}
                                    width={78}
                                    tickMargin={8}
                                />

                                <Tooltip
                                    cursor={{ stroke: tokens.axis, strokeWidth: 1 }}
                                    content={(props) => {
                                        const point = props.payload?.[0]?.payload;
                                        return (
                                            <ChartTooltip
                                                {...props}
                                                extraRows={
                                                    point
                                                        ? [
                                                              {
                                                                  label: "Resultado",
                                                                  value: formatCurrency(point.lucro),
                                                              },
                                                          ]
                                                        : []
                                                }
                                            />
                                        );
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="receita"
                                    name="Receita"
                                    stroke={tokens.revenue}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 2, stroke: tokens.surface }}
                                    isAnimationActive={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="despesa"
                                    name="Despesas"
                                    stroke={tokens.expense}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 2, stroke: tokens.surface }}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : (
                <ChartDataTable
                    caption="Receita, despesas e resultado por mês"
                    rows={data}
                    columns={[
                        {
                            key: "monthKey",
                            label: "Mês",
                            render: (row) => formatMonthKey(row.monthKey),
                        },
                        {
                            key: "receita",
                            label: "Receita",
                            numeric: true,
                            render: (row) => formatCurrency(row.receita),
                        },
                        {
                            key: "despesa",
                            label: "Despesas",
                            numeric: true,
                            render: (row) => formatCurrency(row.despesa),
                        },
                        {
                            key: "lucro",
                            label: "Resultado",
                            numeric: true,
                            render: (row) => formatCurrency(row.lucro),
                        },
                    ]}
                />
            )}
        </Card>
    );
}
