import { useState } from "react";
import { ChartSpline, Table2 } from "lucide-react";
import SegmentedControl from "../ui/SegmentedControl";

const VIEW_OPTIONS = [
    { value: "chart", label: "Ver como gráfico", icon: ChartSpline, title: "Gráfico" },
    { value: "table", label: "Ver como tabela", icon: Table2, title: "Tabela" },
];

export function useChartView(initial = "chart") {
    const [view, setView] = useState(initial);

    const toggle = (
        <SegmentedControl
            options={VIEW_OPTIONS}
            value={view}
            onChange={setView}
            label="Modo de visualização"
        />
    );

    return { view, toggle };
}
