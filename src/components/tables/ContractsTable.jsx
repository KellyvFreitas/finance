import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import SearchInput from "../ui/SearchInput";
import Pagination from "../ui/Pagination";
import SortableHeader from "./SortableHeader";
import { StatusBadge } from "../ui/Badge";
import { useSort } from "../../hooks/useSort";
import { CONTRACT_STATUSES } from "../../lib/dataset";
import { formatCurrency, formatDate } from "../../lib/format";

const PAGE_SIZE = 6;

const ACCESSORS = {
    name: (row) => row.contract.name,
    client: (row) => row.contract.client,
    status: (row) => row.contract.status,
    revenue: (row) => row.revenue,
    result: (row) => row.result,
    endDate: (row) => row.contract.endDate,
};

export default function ContractsTable({ rows, subtitle }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();

        return rows.filter(({ contract }) => {
            if (status !== "all" && contract.status !== status) return false;
            if (!term) return true;

            return [contract.name, contract.client, contract.code, contract.manager]
                .join(" ")
                .toLowerCase()
                .includes(term);
        });
    }, [rows, query, status]);

    const { sorted, sort, toggle } = useSort(filtered, ACCESSORS, {
        key: "revenue",
        direction: "desc",
    });

    const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const updateFilter = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    return (
        <Card title="Contratos" subtitle={subtitle} flush>
            <div className="table__toolbar">
                <SearchInput
                    value={query}
                    onChange={updateFilter(setQuery)}
                    placeholder="Buscar por contrato, cliente ou código"
                    label="Buscar contratos"
                />

                <select
                    className="select"
                    value={status}
                    aria-label="Filtrar por status"
                    style={{ width: "auto" }}
                    onChange={(event) => updateFilter(setStatus)(event.target.value)}
                >
                    <option value="all">Todos os status</option>
                    {CONTRACT_STATUSES.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {visible.length === 0 ? (
                <EmptyState
                    title="Nenhum contrato encontrado"
                    description="Nenhum contrato corresponde à busca ou ao status selecionado."
                />
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="table">
                            <caption className="sr-only">
                                Contratos com receita, resultado e vigência no período
                            </caption>
                            <thead>
                                <tr>
                                    <SortableHeader
                                        label="Contrato"
                                        columnKey="name"
                                        sort={sort}
                                        onSort={toggle}
                                    />
                                    <SortableHeader
                                        label="Cliente"
                                        columnKey="client"
                                        sort={sort}
                                        onSort={toggle}
                                    />
                                    <SortableHeader
                                        label="Status"
                                        columnKey="status"
                                        sort={sort}
                                        onSort={toggle}
                                    />
                                    <SortableHeader
                                        label="Receita"
                                        columnKey="revenue"
                                        sort={sort}
                                        onSort={toggle}
                                        numeric
                                    />
                                    <SortableHeader
                                        label="Resultado"
                                        columnKey="result"
                                        sort={sort}
                                        onSort={toggle}
                                        numeric
                                    />
                                    <SortableHeader
                                        label="Vigência até"
                                        columnKey="endDate"
                                        sort={sort}
                                        onSort={toggle}
                                        numeric
                                    />
                                </tr>
                            </thead>

                            <tbody>
                                {visible.map(({ contract, revenue, result }) => (
                                    <tr
                                        key={contract.id}
                                        className="table__row--link"
                                        onClick={() => navigate(`/contratos/${contract.id}`)}
                                    >
                                        <td>
                                            <Link
                                                to={`/contratos/${contract.id}`}
                                                className="table__link"
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                {contract.name}
                                            </Link>
                                            <span className="table__meta">{contract.code}</span>
                                        </td>
                                        <td>
                                            {contract.client}
                                            <span className="table__meta">{contract.segment}</span>
                                        </td>
                                        <td>
                                            <StatusBadge status={contract.status} />
                                        </td>
                                        <td className="table__num">{formatCurrency(revenue)}</td>
                                        <td className="table__num">
                                            <span
                                                className={
                                                    result < 0 ? "amount--negative" : "amount--in"
                                                }
                                            >
                                                {formatCurrency(result)}
                                            </span>
                                        </td>
                                        <td className="table__num">
                                            {formatDate(contract.endDate)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="table__footer">
                        <span>
                            {sorted.length} contrato{sorted.length === 1 ? "" : "s"}
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
