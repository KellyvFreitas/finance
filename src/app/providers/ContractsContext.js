import { createContext } from "react";

export const ContractsContext = createContext({
    contracts: [],
    contractsById: new Map(),
    loading: true,
    error: null,
});
