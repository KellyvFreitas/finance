const BRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
});

const BRL_CENTS = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const NUMBER = new Intl.NumberFormat("pt-BR");

const DATE_SHORT = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const DATE_LONG = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

const isNil = (value) => value === null || value === undefined || Number.isNaN(value);

export const formatCurrency = (value) => (isNil(value) ? "—" : BRL.format(value));

export const formatCurrencyCents = (value) => (isNil(value) ? "—" : BRL_CENTS.format(value));

export const formatNumber = (value) => (isNil(value) ? "—" : NUMBER.format(value));

export const formatCompactCurrency = (value) => {
    if (isNil(value)) return "—";

    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (abs >= 1_000_000) {
        return `${sign}R$ ${NUMBER.format(Number((abs / 1_000_000).toFixed(1)))} mi`;
    }
    if (abs >= 1_000) {
        return `${sign}R$ ${NUMBER.format(Math.round(abs / 1_000))} mil`;
    }
    return `${sign}R$ ${NUMBER.format(abs)}`;
};

export const formatPercent = (value, fractionDigits = 1) => {
    if (isNil(value)) return "—";

    return `${NUMBER.format(Number(value.toFixed(fractionDigits)))}%`;
};

export const formatDelta = (value, { unit = "%", fractionDigits = 1 } = {}) => {
    if (isNil(value)) return "—";

    const sign = value > 0 ? "+" : "";
    const separator = unit === "%" ? "" : " ";

    return `${sign}${NUMBER.format(Number(value.toFixed(fractionDigits)))}${separator}${unit}`;
};

const toDate = (value) => (value instanceof Date ? value : new Date(value));

export const formatDate = (value) => (value ? DATE_SHORT.format(toDate(value)) : "—");

export const formatDateLong = (value) =>
    value ? DATE_LONG.format(toDate(value)).replace(".", "") : "—";

export const formatMonthKey = (monthKey) => {
    if (!monthKey) return "—";

    const [year, month] = monthKey.split("-");
    const label = new Intl.DateTimeFormat("pt-BR", { month: "short" })
        .format(new Date(Number(year), Number(month) - 1, 1))
        .replace(".", "");

    return `${label}/${year.slice(2)}`;
};

export const percentChange = (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
};
