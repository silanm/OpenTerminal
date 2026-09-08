export type TxInput = {
  id: number;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  executed_at: string;
};

type Lot = { qty: number; price: number };

export type Position = {
  symbol: string;
  quantity: number;
  avgCost: number;
  realizedPnl: number;
};

export type AnnotatedTx = TxInput & { realizedPnl: number | null };

function chrono(a: TxInput, b: TxInput): number {
  const t = a.executed_at.localeCompare(b.executed_at);
  return t !== 0 ? t : a.id - b.id;
}

function fifoSellPnl(queue: Lot[], sellQty: number, sellPrice: number): number {
  const held = queue.reduce((s, l) => s + l.qty, 0);
  let toSell = Math.min(sellQty, held);
  let pnl = 0;
  while (toSell > 0 && queue.length > 0) {
    const lot = queue[0];
    const matched = Math.min(toSell, lot.qty);
    pnl += (sellPrice - lot.price) * matched;
    lot.qty -= matched;
    toSell -= matched;
    if (lot.qty === 0) queue.shift();
  }
  return pnl;
}

/** FIFO lot replay: per-sell realized P&L and leftover positions. */
export function replayLots(txs: TxInput[]): { positions: Position[]; annotatedTxs: AnnotatedTx[] } {
  const sorted = [...txs].sort(chrono);
  const lots = new Map<string, Lot[]>();
  const realizedBySymbol = new Map<string, number>();
  const pnlByTxId = new Map<number, number | null>();

  for (const tx of sorted) {
    if (tx.side === "BUY") {
      let queue = lots.get(tx.symbol);
      if (!queue) {
        queue = [];
        lots.set(tx.symbol, queue);
      }
      queue.push({ qty: tx.quantity, price: tx.price });
      pnlByTxId.set(tx.id, null);
    } else {
      let queue = lots.get(tx.symbol);
      if (!queue) {
        queue = [];
        lots.set(tx.symbol, queue);
      }
      const pnl = fifoSellPnl(queue, tx.quantity, tx.price);
      pnlByTxId.set(tx.id, pnl);
      realizedBySymbol.set(tx.symbol, (realizedBySymbol.get(tx.symbol) ?? 0) + pnl);
    }
  }

  const positions: Position[] = [];
  for (const [symbol, queue] of lots.entries()) {
    const quantity = queue.reduce((s, l) => s + l.qty, 0);
    const cost = queue.reduce((s, l) => s + l.qty * l.price, 0);
    const avgCost = quantity > 0 ? cost / quantity : 0;
    const realizedPnl = realizedBySymbol.get(symbol) ?? 0;
    if (quantity > 0 || realizedPnl !== 0) {
      positions.push({ symbol, quantity, avgCost, realizedPnl });
    }
  }

  const annotatedTxs = txs.map((tx) => ({
    ...tx,
    realizedPnl: pnlByTxId.has(tx.id) ? pnlByTxId.get(tx.id)! : null,
  }));

  return { positions, annotatedTxs };
}
