---
title: Holdings
description: Personal SET and US names, theses, and tracker rules. Fill this table; do not invent tickers.
tags:
  - holdings
  - personal
---
# Holdings

Personal list. In this repo on purpose. Fill the table; empty rows mean nothing is tracked yet.

Do not invent tickers here. When a name is added, use the Yahoo-style symbol from [SET market](./set-market.md) (`PTT.BK`) or a US ticker (`AAPL`).

## Names

| Symbol | Name | Market | Thesis / notes |
|---|---|---|---|
| | | SET or US | |

## Tracker rules

Edit these as you decide them:

- Default market when the terminal opens:
- Lots / odd-lot policy:
- Fees included in average cost? (proposed yes, see [Portfolio](./portfolio.md))
- Dividends: cash tracked separately from cost (proposed)
- What you will not track in this app:

## Watchlist seed (later)

Once the SET path works, replace or split the hardcoded US watchlist in `web/store/terminal.ts`. Put the SET names you actually watch in the table above first, then we copy them into the default store.
