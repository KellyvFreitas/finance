import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ScrollToTop from "./components/layout/ScrollToTop";
import Overview from "./pages/Overview";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>
                <Route element={<AppShell />}>
                    <Route path="/" element={<Overview />} />
                    <Route path="/contratos" element={<Contracts />} />
                    <Route path="/contratos/:id" element={<ContractDetail />} />
                    <Route path="/transacoes" element={<Transactions />} />
                    {/* Legacy path from the first version of the dashboard. */}
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
