---
title: SET market
description: How Thai quotes, charts, and search should work beside the existing US path.
tags:
  - set
  - quotes
  - charts
---
# SET market

First build target: live SET (and mai) quotes, charts, and command-palette search, as an equal market next to US and crypto.

## Ticker convention we will use

Internal symbols should be Yahoo-style with a `.BK` suffix (`PTT.BK`, `AOT.BK`, `DELTA.BK`) so they never collide with a US ticker of the same letters. Display can strip `.BK` in the UI if we want it to look like SET.

This is a project decision, not a claim about SET's own API. Confirm against a live Yahoo quote the first time we wire it. (TODO: needs source once we ingest a sample quote payload.)

TradingView's SET prefix is commonly `SET:` (and `SET:` / mai listings on TradingView). Do not send those names to `scanner.tradingview.com/america/scan`. (TODO: needs source for the exact Thai scanner path before we implement heatmap/screener. Heatmap is out of v1 anyway.)

## What to change in this repo

1. Add SET / mai to `EXCHANGE_SUFFIX` in `server/src/providers/tradingview.ts` (`SET` → `.BK`).
2. Stop forcing `sort_by_country=US` when the user is searching Thai names, or run a second search scoped to Thailand.
3. In `getQuotes` (`server/src/routes/market.ts`), skip Nasdaq for `.BK` symbols. Send them to Yahoo (then Stooq) first.
4. Same skip for candles, options (SET options are out of v1), and TradingView America fundamentals.
5. Default watchlist / active symbol should be choosable per market, not hardcoded `AAPL` only. Keep AAPL as the US default; pick a SET default later from [Holdings](./holdings.md).

## What we are not doing yet

- SET/mai sector heatmap and full screener (TradingView Thai scanner is a later task).
- NVDR, warrants, and `-R` foreign board as first-class types. If a `.BK` quote works, that is enough for v1.
- A dedicated SETTRADE or SET website scraper until Yahoo/TradingView coverage is proven thin.

See [Providers](./providers.md) for the current chains and [Roadmap](./roadmap.md) for order.
