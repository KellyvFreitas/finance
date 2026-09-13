const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function get(path, params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) query.set(key, value);
    });

    const url = `${API_BASE_URL}${path}${query.toString() ? `?${query}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Falha ao buscar ${path} (status ${response.status})`);
    }

    return response.json();
}

export function fetchContracts() {
    return get("/api/contracts");
}

export function fetchTransactions({ contractId } = {}) {
    return get("/api/transactions", { contractId });
}

export function fetchOverview({ months, contractId } = {}) {
    return get("/api/overview", { months, contractId });
}
