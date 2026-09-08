import { describe, expect, it } from "vitest";
import { replayLots, type TxInput } from "./portfolioLots.js";

function tx(
  id: number,
  symbol: string,
  side: "BUY" | "SELL",
  quantity: number,
  price: number,
  executed_at: string
): TxInput {
  return { id, symbol, side, quantity, price, executed_at };
}

describe("replayLots", () => {
  it("PTTEP book: two sells annotate to -63000 and +10000, total -53000", () => {
    const txs = [
      tx(1, "PTTEP", "BUY", 1000, 150, "2026-09-08T10:00:00Z"),
      tx(2, "PTTEP", "SELL", 900, 80, "2026-09-08T11:00:00Z"),
      tx(3, "PTTEP", "SELL", 100, 250, "2026-09-08T12:00:00Z"),
    ];
    const { positions, annotatedTxs } = replayLots(txs);

    const byId = Object.fromEntries(annotatedTxs.map((t) => [t.id, t.realizedPnl]));
    expect(byId[1]).toBeNull();
    expect(byId[2]).toBe(-63000);
    expect(byId[3]).toBe(10000);

    expect(positions).toEqual([
      { symbol: "PTTEP", quantity: 0, avgCost: 0, realizedPnl: -53000 },
    ]);
  });

  it("two buys at different prices: FIFO P&L differs from average cost", () => {
    const txs = [
      tx(1, "ABC", "BUY", 100, 10, "2026-01-01T00:00:00Z"),
      tx(2, "ABC", "BUY", 100, 20, "2026-01-02T00:00:00Z"),
      tx(3, "ABC", "SELL", 100, 25, "2026-01-03T00:00:00Z"),
    ];
    const { positions, annotatedTxs } = replayLots(txs);

    const sell = annotatedTxs.find((t) => t.id === 3)!;
    expect(sell.realizedPnl).toBe(1500); // FIFO: (25-10)*100
    // average cost would be (25-15)*100 = 1000

    expect(positions).toEqual([
      { symbol: "ABC", quantity: 100, avgCost: 20, realizedPnl: 1500 },
    ]);
  });

  it("partial lot consume leaves remainder on the queue", () => {
    const txs = [
      tx(1, "XYZ", "BUY", 100, 10, "2026-01-01T00:00:00Z"),
      tx(2, "XYZ", "SELL", 30, 15, "2026-01-02T00:00:00Z"),
    ];
    const { positions, annotatedTxs } = replayLots(txs);

    expect(annotatedTxs.find((t) => t.id === 2)!.realizedPnl).toBe(150);
    expect(positions).toEqual([
      { symbol: "XYZ", quantity: 70, avgCost: 10, realizedPnl: 150 },
    ]);
  });
});
