---
title: Roadmap
description: Build order for SET quotes, THB portfolio, dividends, and Thai news.
tags:
  - roadmap
  - set
---
# Roadmap

Personal dual-market fork. Upstream README roadmap (workspaces, economic calendar, drawing tools) is separate unless it blocks this list.

## Shipped in this fork

- [Commodities](./commodities.md) — Thai gold bar/jewelry (GTA), GLD, XAU, WTI, Brent

## v1 (in scope)

1. **SET quotes, charts, search** — [SET market](./set-market.md), [Providers](./providers.md)
   - `.BK` suffix mapping
   - Skip Nasdaq for Thai symbols
   - Search that can find SET names
2. **THB portfolio** — [Portfolio](./portfolio.md)
   - Currency on transactions
   - Optional fees in average cost
   - UI that does not label SET lots as USD
3. **Dividends / XD** — [Portfolio](./portfolio.md)
   - Manual entry first; calendar provider only after a sourced feed exists
4. **Thai news** — [News](./news.md)
   - Feeds chosen and ingested, then wired for `.BK` symbols

## Later (explicitly out of v1)

- SET/mai screener and sector heatmap
- Multiple accounts (RMF/SSF, US brokerage) with a combined view
- FX so mixed THB/USD holdings roll up to one NAV
- SET options, NVDR, warrants as first-class types

## How we use this page

Check off items when the matching wiki page and the code agree. Do not mark SET quotes done until a `.BK` symbol shows a live price in the quote widget.
