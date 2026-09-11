import { useMemo, useState } from "react";

export function useSort(rows, accessors, initial) {
    const [sort, setSort] = useState(initial);

    const toggle = (key) =>
        setSort((current) =>
            current.key === key
                ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
                : { key, direction: "asc" },
        );

    const sorted = useMemo(() => {
        const accessor = accessors[sort.key];
        if (!accessor) return rows;

        const factor = sort.direction === "asc" ? 1 : -1;

        return [...rows].sort((a, b) => {
            const left = accessor(a);
            const right = accessor(b);

            if (typeof left === "number" && typeof right === "number") {
                return (left - right) * factor;
            }

            return String(left).localeCompare(String(right), "pt-BR") * factor;
        });
    }, [rows, accessors, sort]);

    return { sorted, sort, toggle };
}
