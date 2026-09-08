---
title: Portfolio
description: FIFO lot-matched portfolio tracker and the THB / dividends work ahead.
tags:
  - portfolio
  - thb
  - dividends
---
# Portfolio

The tracker is local SQLite, not a broker sync. Schema is in `server/src/db.ts`. FIFO replay is in `server/src/portfolioLots.ts`; routes in `server/src/routes/portfolio.ts`. UI is `web/components/widgets/PortfolioWidget.tsx`.

## What it does now

- Named portfolios (default "Main").
- BUY/SELL rows: symbol, quantity, price, executed_at.
- Cost basis: **FIFO** (oldest buy lots matched first on sells). Per-sell realized P&L is computed on read and shown on the TRANSACTIONS tab; BUY rows show no realized P&L.
- Positions: remaining qty, avg cost of leftover lots (display only), symbol-level realized P&L (sum of FIFO-matched sells). Header **Rlzd** equals the sum of sell-row P&Ls.
- Symbol is uppercased and limited to 12 characters. `PTT.BK` fits.
- No currency field. Prices are bare numbers (the US UI implies USD).
- No fees, no dividends, no lot size.

## THB portfolio (v1)

Keep one ledger, but treat SET trades as THB:

- Store `currency` on the transaction (THB vs USD) so US and Thai lots do not mix silently. FX conversion is out of v1; show P&L in the trade's own currency.
- Optional `fee` on the transaction (broker commission). FIFO lot cost should include fees on buys.
- SET board lots: do not block odd lots in v1 unless you want that rule. If we add it, it belongs here as a validation, not as a guess about SET regulations.
- UI: show THB for `.BK` rows, USD otherwise, until a market toggle exists.

## Dividends and XD

New table (name TBD), not overloaded onto `transactions`:

- symbol, ex-date, payment date, per-share amount, currency
- Cash dividends increase cash / realized income; they should not change lot cost unless we explicitly choose a total-return method. Default: track dividend cash separately from FIFO lot cost.

We do not yet have a SET dividend calendar provider. Until one is ingested, dividends can be entered by hand on the widget.

Out of v1: multiple accounts (RMF/SSF vs cash), FX to a combined THB NAV. See [Roadmap](./roadmap.md).

Personal names: [Holdings](./holdings.md).
