import clsx from "clsx";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export default function SortableHeader({ label, columnKey, sort, onSort, numeric }) {
    const isActive = sort.key === columnKey;
    const Icon = !isActive ? ChevronsUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;

    return (
        <th
            scope="col"
            className={numeric ? "table__num" : undefined}
            aria-sort={isActive ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
        >
            <button
                type="button"
                className={clsx("th-sort", isActive && "th-sort--active")}
                onClick={() => onSort(columnKey)}
            >
                {label}
                <Icon size={13} className="th-sort__icon" aria-hidden="true" />
            </button>
        </th>
    );
}
