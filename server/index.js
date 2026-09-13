import express from "express";
import cors from "cors";
import { contracts, transactions, getOverview } from "./data.js";

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Servidor no ar!" });
});

app.get("/api/contracts", (req, res) => {
  res.json(contracts);
});

app.get("/api/transactions", (req, res) => {
  const { contractId } = req.query;

  if (contractId) {
    const filtered = transactions.filter((row) => row.contractId === Number(contractId));
    return res.json(filtered);
  }

  res.json(transactions);
});

app.get("/api/overview", (req, res) => {
  const months = Number(req.query.months) || 12;
  const contractId = req.query.contractId ? Number(req.query.contractId) : null;

  res.json(getOverview({ months, contractId }));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
