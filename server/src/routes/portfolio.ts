import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { replayLots, type TxInput } from "../portfolioLots.js";

export const portfolioRouter = Router();

portfolioRouter.get("/", (_req, res) => {
  res.json(db.prepare("SELECT * FROM portfolios ORDER BY id").all());
});

portfolioRouter.post("/", (req, res) => {
  const parsed = z.object({ name: z.string().min(1).max(64) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  try {
    const info = db.prepare("INSERT INTO portfolios (name) VALUES (?)").run(parsed.data.name);
    res.status(201).json({ id: info.lastInsertRowid, name: parsed.data.name });
  } catch {
    res.status(409).json({ error: "portfolio name already exists" });
  }
});

portfolioRouter.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM transactions WHERE portfolio_id = ?").run(req.params.id);
  db.prepare("DELETE FROM portfolios WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

const txSchema = z.object({
  symbol: z.string().min(1).max(12).transform((s) => s.toUpperCase()),
  side: z.enum(["BUY", "SELL"]),
  quantity: z.number().positive(),
  price: z.number().nonnegative(),
  executed_at: z.string(),
});

portfolioRouter.get("/:id/transactions", (req, res) => {
  const txs = db
    .prepare("SELECT * FROM transactions WHERE portfolio_id = ? ORDER BY executed_at DESC, id DESC")
    .all(req.params.id) as TxInput[];
  const { annotatedTxs } = replayLots(txs);
  const byId = new Map(annotatedTxs.map((t) => [t.id, t]));
  res.json(txs.map((t) => byId.get(t.id)!));
});

portfolioRouter.post("/:id/transactions", (req, res) => {
  const parsed = txSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const t = parsed.data;
  const info = db
    .prepare(
      "INSERT INTO transactions (portfolio_id, symbol, side, quantity, price, executed_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(req.params.id, t.symbol, t.side, t.quantity, t.price, t.executed_at);
  res.status(201).json({ id: info.lastInsertRowid, ...t });
});

portfolioRouter.delete("/:id/transactions/:txId", (req, res) => {
  db.prepare("DELETE FROM transactions WHERE id = ? AND portfolio_id = ?").run(req.params.txId, req.params.id);
  res.status(204).end();
});

/** Aggregated positions with FIFO-matched realized PnL. */
portfolioRouter.get("/:id/positions", (req, res) => {
  const txs = db
    .prepare("SELECT * FROM transactions WHERE portfolio_id = ? ORDER BY executed_at, id")
    .all(req.params.id) as TxInput[];
  res.json(replayLots(txs).positions);
});
