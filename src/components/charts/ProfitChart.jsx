import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Card from "../ui/Card";
import ChartLegend from "./ChartLegend";
import ChartTooltip from "./ChartTooltip";
import ChartDataTable from "./ChartDataTable";
import RoundedBar from "./RoundedBar";
import { useChartView } from "./useChartView";
import { useChartTokens } from "../../hooks/useChartTokens";
import { formatCompactCurrency, formatCurrency, formatMonthKey } from "../../lib/format";

export default function ProfitChart({ data, subtitle }) {
    const tokens = useChartTokens();
    const { view, toggle } = useChartView();

    const hasNegative = data.some((row) => row.lucro < 0);

    const legend = [
        { label: "Resultado positivo", color: tokens.profit },
        ...(hasNegative ? [{ label: "Resultado negativo", color: tokens.critical }] : []),
    ];

    return (
        <Card title="Resultado mensal" subtitle={subtitle} actions={toggle} flush>
            {view === "chart" ? (
                <>
                    <ChartLegend items={legend} />

                    <div className="chart-frame">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
                                barCategoryGap="28%"
                            >
                                <CartesianGrid vertical={false} stroke={tokens.grid} />

                                <XAxis
                                    dataKey="monthKey"
                                    tickFormatter={formatMonthKey}
                                    tickLine={false}
                                    axisLine={{ stroke: tokens.axis }}
                                    tickMargin={10}
                                    minTickGap={24}
                                    interval="preserveStartEnd"
                                />

                                <YAxis
                                    tickFormatter={formatCompactCurrency}
                                    tickLine={false}
                                    axisLine={false}
                                    width={78}
                                    tickMargin={8}
                                />

                                <Tooltip
                                    cursor={{ fill: tokens.grid, fillOpacity: 0.5 }}
                                    content={<ChartTooltip />}
                                />

                                <ReferenceLine y={0} stroke={tokens.axis} />

                                <Bar
                                    dataKey="lucro"
                                    name="Resultado"
                                    maxBarSize={24}
                                    shape={<RoundedBar />}
                                    isAnimationActive={false}
                                >
                                    {data.map((row) => (
                                        <Cell
                                            key={row.monthKey}
                                            negative={row.lucro < 0}
                                            fill={row.lucro < 0 ? tokens.critical : tokens.profit}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : (
                <ChartDataTable
                    caption="Resultado por mês"
                    rows={data}
                    columns={[
                        {
                            key: "monthKey",
                            label: "Mês",
                            render: (row) => formatMonthKey(row.monthKey),
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
