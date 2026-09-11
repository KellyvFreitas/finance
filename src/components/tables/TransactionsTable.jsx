import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SearchInput from "../ui/SearchInput";
import Pagination from "../ui/Pagination";
import SortableHeader from "./SortableHeader";
import { Badge } from "../ui/Badge";
import { useSort } from "../../hooks/useSort";
import { contractsById } from "../../lib/dataset";
import { formatCurrency, formatDate } from "../../lib/format";

const ACCESSORS = {
    date: (row) => row.date,
    description: (row) => row.description,
    category: (row) => row.category,
    amount: (row) => (row.type === "receita" ? row.amount : -row.amount),
};

const STATUS_VARIANTS = {
    Pago: "good",
    Pendente: "warning",
    Atrasado: "critical",
};

export default function TransactionsTable({
    rows,
    title = "Transações",
    subtitle,
    showFilters = true,
    showContract = true,
    pageSize = 10,
}) {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("all");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();

        return rows.filter((row) => {
            if (type !== "all" && row.type !== type) return false;
            if (!term) return true;

            const contract = contractsById.get(row.contractId);

            return [row.description, row.category, contract?.name, contract?.client]
                .join(" ")
                .toLowerCase()
                .includes(term);
        });
    }, [rows, query, type]);

    const { sorted, sort, toggle } = useSort(filtered, ACCESSORS, {
        key: "date",
        direction: "desc",
    });

    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, pageCount);
    const visible = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    const updateFilter = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    return (
        <Card title={title} subtitle={subtitle} flush>
            {showFilters && (
                <div className="table__toolbar">
                    <SearchInput
                        value={query}
                        onChange={updateFilter(setQuery)}
                        placeholder="Buscar por descrição, categoria ou contrato"
                        label="Buscar transações"
                    />

                    <select
                        className="select"
                        value={type}
                        aria-label="Filtrar por tipo"
                        style={{ width: "auto" }}
                        onChange={(event) => updateFilter(setType)(event.target.value)}
                    >
                        <option value="all">Receitas e despesas</option>
                        <option value="receita">Somente receitas</option>
                        <option value="despesa">Somente despesas</option>
                    </select>
                </div>
            )}

            {visible.length === 0 ? (
                <EmptyState
                    title="Nenhuma transação encontrada"
                    description="Ajuste a busca, o tipo de lançamento ou o período selecionado."
                />
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="table">
                            <caption className="sr-only">
                                Lançamentos financeiros do período
                            </caption>
                            <thead>
                                <tr>
                                    <SortableHeader
                                        label="Data"
                                        columnKey="date"
                                        sort={sort}
                                        onSort={toggle}
                                    />
                                    <SortableHeader
                                        label="Descrição"
                                        columnKey="description"
                                        sort={sort}
                                        onSort={toggle}
                                    />
                                    {showContract && (
                                        <th scope="col">Contrato</th>
                                    )}
                                    <SortableHeader
                                        label="Categoria"
                                        columnKey="category"
                                        sort={sort}
                                        onSort={toggle}
                                    />
                                    <th scope="col">Situação</th>
                                    <SortableHeader
                                        label="Valor"
                                        columnKey="amount"
                                        sort={sort}
                                        onSort={toggle}
                                        numeric
                                    />
                                </tr>
                            </thead>

                            <tbody>
                                {visible.map((row) => {
                                    const contract = contractsById.get(row.contractId);
                                    const isRevenue = row.type === "receita";
                                    const Icon = isRevenue ? ArrowUpRight : ArrowDownLeft;

                                    return (
                                        <tr key={row.id}>
                                            <td className="table__num">{formatDate(row.date)}</td>
                                            <td className="table__primary">
                                                {row.description}
                                                <span className="table__meta">{row.id}</span>
                                            </td>
                                            {showContract && (
                                                <td>
                                                    {contract?.name ?? "—"}
                                                    <span className="table__meta">
                                                        {contract?.client}
                                                    </span>
                                                </td>
                                            )}
                                            <td>{row.category}</td>
                                            <td>
                                                <Badge variant={STATUS_VARIANTS[row.status]}>
                                                    {row.status}
                                                </Badge>
                                            </td>
                                            <td className="table__num">
                                                <span
                                                    className={
                                                        isRevenue ? "amount--in" : "amount--out"
                                                    }
                                                >
                                                    <Icon
                                                        size={13}
                                                        aria-hidden="true"
                                                        style={{
                                                            display: "inline",
                                                            verticalAlign: "-2px",
                                                        }}
                                                    />{" "}
                                                    {formatCurrency(row.amount)}
                                                </span>
                                                <span className="sr-only">
                                                    {isRevenue ? "receita" : "despesa"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="table__footer">
                        <span>
                            {sorted.length} lançamento{sorted.length === 1 ? "" : "s"}
                        </span>
                        <Pagination
                            page={safePage}
                            pageCount={pageCount}
                            onPageChange={setPage}
                        />
                    </div>
                </>
            )}
        </Card>
    );
}
