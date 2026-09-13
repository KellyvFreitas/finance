import { useEffect, useMemo, useState } from "react";
import { fetchContracts } from "../../lib/api";
import { ContractsContext } from "./ContractsContext";

export function ContractsProvider({ children }) {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetchContracts()
            .then((result) => {
                if (!cancelled) setContracts(result);
            })
            .catch((err) => {
                if (!cancelled) setError(err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const contractsById = useMemo(
        () => new Map(contracts.map((contract) => [contract.id, contract])),
        [contracts],
    );

    const value = useMemo(
        () => ({ contracts, contractsById, loading, error }),
        [contracts, contractsById, loading, error],
    );

    return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>;
}
