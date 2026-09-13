import { useContext } from "react";
import { ContractsContext } from "./ContractsContext";

export function useContracts() {
    return useContext(ContractsContext);
}
