"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet, fmt, pctClass } from "../../lib/api";
import { useTerminal } from "../../store/terminal";
import Flash from "../Flash";

type ThaiRow = { label: string; unit: string; buy: number; sell: number };
type CommodityQuote = {
  symbol: string;
  label: string;
  price: number | null;
  changePercent: number | null;
  currency: string | null;
};
type Commodities = {
  thai: { asOf: string; bar: ThaiRow; jewelry: ThaiRow } | null;
  quotes: CommodityQuote[];
};

export default function CommoditiesWidget() {
  const setActiveSymbol = useTerminal((s) => s.setActiveSymbol);
  const { data, error } = useQuery({
    queryKey: ["commodities"],
    queryFn: () => apiGet<Commodities>("/api/commodities"),
    refetchInterval: 15_000,
  });

  if (error) return <div className="p-2 down">Error: {(error as Error).message}</div>;
  if (!data) return <div className="p-2 dim">Loading commodities…</div>;

  const thaiRows = data.thai ? [data.thai.bar, data.thai.jewelry] : [];

  return (
    <div>
      <div className="px-2 py-1 dim text-[10px] uppercase flex justify-between">
        <span>Thai gold (GTA)</span>
        {data.thai && <span className="normal-case">{data.thai.asOf}</span>}
      </div>
      {thaiRows.length === 0 ? (
        <div className="px-2 pb-2 dim">Thai gold unavailable</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Buy</th>
              <th>Sell</th>
            </tr>
          </thead>
          <tbody>
            {thaiRows.map((r) => (
              <tr key={r.label}>
                <td>
                  {r.label}
                  <div className="dim text-[9px]">{r.unit}</div>
                </td>
                <td>
                  <Flash value={r.buy}>{fmt(r.buy, 2)}</Flash>
                </td>
                <td>
                  <Flash value={r.sell}>{fmt(r.sell, 2)}</Flash>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="px-2 py-1 dim text-[10px] uppercase border-t border-[#161616]">Spot / ETF / futures</div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Last</th>
            <th>Chg%</th>
          </tr>
        </thead>
        <tbody>
          {data.quotes.map((q) => (
            <tr key={q.symbol} onClick={() => setActiveSymbol(q.symbol)}>
              <td>
                {q.label}
                <div className="dim text-[9px]">{q.symbol}</div>
              </td>
              <td>
                <Flash value={q.price}>{fmt(q.price)}</Flash>
              </td>
              <td className={pctClass(q.changePercent)}>
                <Flash value={q.changePercent}>{fmt(q.changePercent)}%</Flash>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
