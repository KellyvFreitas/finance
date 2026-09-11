function createRandom(seed) {
    let state = seed >>> 0;

    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const MONTHS_OF_HISTORY = 24;

export const EXPENSE_CATEGORIES = [
    "Equipe",
    "Infraestrutura",
    "Licenças",
    "Terceiros",
    "Marketing",
    "Viagens",
];

export const CONTRACT_STATUSES = ["Ativo", "Em risco", "Em negociação", "Encerrado"];

const CONTRACT_SEEDS = [
    {
        code: "CT-2024-001",
        name: "Plataforma de Pagamentos",
        client: "Nubank Serviços",
        segment: "Fintech",
        manager: "Ana Ribeiro",
        status: "Ativo",
        mrr: 148_000,
        costRatio: 0.62,
        startedMonthsAgo: 22,
    },
    {
        code: "CT-2024-014",
        name: "Modernização do Core Bancário",
        client: "Banco Aurora",
        segment: "Bancário",
        manager: "Carlos Menezes",
        status: "Ativo",
        mrr: 212_000,
        costRatio: 0.68,
        startedMonthsAgo: 20,
    },
    {
        code: "CT-2025-003",
        name: "Portal do Cooperado",
        client: "Cooperativa Vale Verde",
        segment: "Cooperativa",
        manager: "Marina Lopes",
        status: "Ativo",
        mrr: 86_000,
        costRatio: 0.58,
        startedMonthsAgo: 15,
    },
    {
        code: "CT-2025-008",
        name: "Motor Antifraude",
        client: "Seguros Atlântico",
        segment: "Seguros",
        manager: "Rafael Duarte",
        status: "Em risco",
        mrr: 64_000,
        costRatio: 1.09,
        startedMonthsAgo: 11,
    },
    {
        code: "CT-2025-021",
        name: "Data Lake Corporativo",
        client: "Grupo Meridiano",
        segment: "Varejo",
        manager: "Ana Ribeiro",
        status: "Ativo",
        mrr: 132_000,
        costRatio: 0.64,
        startedMonthsAgo: 9,
    },
    {
        code: "CT-2026-002",
        name: "App de Investimentos",
        client: "Vertex Capital",
        segment: "Investimentos",
        manager: "Juliana Prado",
        status: "Ativo",
        mrr: 97_000,
        costRatio: 0.6,
        startedMonthsAgo: 6,
    },
    {
        code: "CT-2024-006",
        name: "Integração de Adquirência",
        client: "PagueMais",
        segment: "Fintech",
        manager: "Carlos Menezes",
        status: "Encerrado",
        mrr: 74_000,
        costRatio: 0.71,
        startedMonthsAgo: 23,
        endedMonthsAgo: 7,
    },
    {
        code: "CT-2026-011",
        name: "Open Finance — Fase 2",
        client: "Banco Aurora",
        segment: "Bancário",
        manager: "Marina Lopes",
        status: "Em negociação",
        mrr: 118_000,
        costRatio: 0.6,
        startedMonthsAgo: 0,
    },
];

const REVENUE_DESCRIPTIONS = [
    "Fatura mensal — squad alocado",
    "Marco de entrega aprovado",
    "Licenciamento de plataforma",
    "Horas adicionais aprovadas",
];

const EXPENSE_DESCRIPTIONS = {
    Equipe: ["Folha do squad", "Encargos e benefícios", "Bônus de entrega"],
    Infraestrutura: ["Cloud e observabilidade", "Ambiente de homologação", "Banco de dados gerenciado"],
    Licenças: ["Licenças de software", "Ferramentas de CI/CD", "Assinaturas de APIs"],
    Terceiros: ["Consultoria especializada", "Fábrica de software parceira", "Auditoria técnica"],
    Marketing: ["Campanha de aquisição", "Evento do setor", "Produção de conteúdo"],
    Viagens: ["Viagem de kickoff", "Workshop presencial", "Visita técnica ao cliente"],
};

const CATEGORY_WEIGHTS = {
    Equipe: 0.52,
    Infraestrutura: 0.18,
    Licenças: 0.1,
    Terceiros: 0.12,
    Marketing: 0.05,
    Viagens: 0.03,
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date, amount) =>
    new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const toMonthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const REFERENCE_MONTH = startOfMonth(new Date());

export const ALL_MONTHS = Array.from({ length: MONTHS_OF_HISTORY }, (_, index) =>
    toMonthKey(addMonths(REFERENCE_MONTH, index - (MONTHS_OF_HISTORY - 1))),
);

const toIsoDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
    ).padStart(2, "0")}`;

function buildContracts() {
    return CONTRACT_SEEDS.map((seed, index) => {
        const random = createRandom(1000 + index * 37);
        const startDate = addMonths(REFERENCE_MONTH, -seed.startedMonthsAgo);
        const endDate =
            seed.endedMonthsAgo !== undefined
                ? addMonths(REFERENCE_MONTH, -seed.endedMonthsAgo)
                : addMonths(REFERENCE_MONTH, 6 + Math.round(random() * 12));

        return {
            id: index + 1,
            code: seed.code,
            name: seed.name,
            client: seed.client,
            segment: seed.segment,
            manager: seed.manager,
            status: seed.status,
            mrr: seed.mrr,
            costRatio: seed.costRatio,
            startDate: toIsoDate(startDate),
            endDate: toIsoDate(endDate),
            totalValue: seed.mrr * (seed.startedMonthsAgo + 6),
            healthScore: Math.round(
                seed.status === "Em risco" ? 38 + random() * 18 : 72 + random() * 26,
            ),
        };
    });
}

export const contracts = buildContracts();

function activeMonthsFor(contract) {
    const start = toMonthKey(new Date(contract.startDate));
    const end = toMonthKey(new Date(contract.endDate));

    return ALL_MONTHS.filter((month) => month >= start && month <= end);
}

function buildTransactions() {
    const rows = [];
    let sequence = 0;

    contracts.forEach((contract, contractIndex) => {
        if (contract.status === "Em negociação") return;

        const random = createRandom(5000 + contractIndex * 101);
        const months = activeMonthsFor(contract);

        months.forEach((monthKey, monthIndex) => {
            const [year, month] = monthKey.split("-").map(Number);
            const ramp = 0.82 + Math.min(monthIndex / months.length, 1) * 0.34;
            const noise = 0.9 + random() * 0.2;
            const revenue = Math.round((contract.mrr * ramp * noise) / 100) * 100;

            const invoiceDay = 3 + ((contractIndex * 7 + monthIndex * 5) % 25);

            rows.push({
                id: `T${String(++sequence).padStart(4, "0")}`,
                contractId: contract.id,
                date: toIsoDate(new Date(year, month - 1, invoiceDay)),
                monthKey,
                type: "receita",
                category: "Faturamento",
                description: REVENUE_DESCRIPTIONS[monthIndex % REVENUE_DESCRIPTIONS.length],
                amount: revenue,
                status: monthIndex === months.length - 1 ? "Pendente" : "Pago",
            });

            const costBase = revenue * contract.costRatio * (0.92 + random() * 0.18);

            EXPENSE_CATEGORIES.forEach((category, categoryIndex) => {
                const weight = CATEGORY_WEIGHTS[category];
                if (weight < 0.08 && random() > 0.55) return;

                const amount = Math.round((costBase * weight * (0.85 + random() * 0.3)) / 100) * 100;
                if (amount <= 0) return;

                const descriptions = EXPENSE_DESCRIPTIONS[category];
                const day = 6 + ((categoryIndex * 4 + monthIndex) % 20);

                rows.push({
                    id: `T${String(++sequence).padStart(4, "0")}`,
                    contractId: contract.id,
                    date: toIsoDate(new Date(year, month - 1, day)),
                    monthKey,
                    type: "despesa",
                    category,
                    description: descriptions[monthIndex % descriptions.length],
                    amount,
                    status: random() > 0.94 ? "Atrasado" : "Pago",
                });
            });
        });
    });

    return rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export const transactions = buildTransactions();

export const contractsById = new Map(contracts.map((contract) => [contract.id, contract]));

export const PERIOD_OPTIONS = [
    { value: 3, label: "3 meses" },
    { value: 6, label: "6 meses" },
    { value: 12, label: "12 meses" },
];

export function getPeriod(months) {
    const current = ALL_MONTHS.slice(-months);
    const previous = ALL_MONTHS.slice(-months * 2, -months);

    return { current, previous };
}

export function filterTransactions(rows, { months, contractId } = {}) {
    const period = months ? new Set(getPeriod(months).current) : null;

    return rows.filter((row) => {
        if (period && !period.has(row.monthKey)) return false;
        if (contractId && row.contractId !== contractId) return false;
        return true;
    });
}

export function summarize(rows) {
    let revenue = 0;
    let expenses = 0;

    rows.forEach((row) => {
        if (row.type === "receita") revenue += row.amount;
        else expenses += row.amount;
    });

    const profit = revenue - expenses;

    return {
        revenue,
        expenses,
        profit,
        margin: revenue ? (profit / revenue) * 100 : 0,
    };
}

export function monthlySeries(rows, monthKeys) {
    const buckets = new Map(
        monthKeys.map((month) => [month, { monthKey: month, receita: 0, despesa: 0 }]),
    );

    rows.forEach((row) => {
        const bucket = buckets.get(row.monthKey);
        if (!bucket) return;
        bucket[row.type] += row.amount;
    });

    return monthKeys.map((month) => {
        const bucket = buckets.get(month);
        return { ...bucket, lucro: bucket.receita - bucket.despesa };
    });
}

export function categoryBreakdown(rows) {
    const totals = new Map();

    rows.forEach((row) => {
        if (row.type !== "despesa") return;
        totals.set(row.category, (totals.get(row.category) ?? 0) + row.amount);
    });

    const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);

    return [...totals.entries()]
        .map(([category, value]) => ({
            category,
            value,
            share: grandTotal ? (value / grandTotal) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value);
}

export function revenueByContract(rows) {
    const totals = new Map();

    rows.forEach((row) => {
        if (row.type !== "receita") return;
        totals.set(row.contractId, (totals.get(row.contractId) ?? 0) + row.amount);
    });

    return contracts
        .map((contract) => ({
            contract,
            revenue: totals.get(contract.id) ?? 0,
        }))
        .filter((entry) => entry.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue);
}
