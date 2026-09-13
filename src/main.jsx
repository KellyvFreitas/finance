import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { ContractsProvider } from "./app/providers/ContractsProvider";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
            <ContractsProvider>
                <App />
            </ContractsProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
