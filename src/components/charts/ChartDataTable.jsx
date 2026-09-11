export default function ChartDataTable({ caption, columns, rows }) {
    return (
        <div className="table-wrap">
            <table className="table">
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={column.numeric ? "table__num" : undefined}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.key ?? index}>
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={column.numeric ? "table__num" : "table__primary"}
                                >
                                    {column.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
