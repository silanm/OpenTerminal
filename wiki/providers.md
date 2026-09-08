---
title: Providers
description: Current market-data fallback chains and the gaps that block SET tickers.
tags:
  - providers
  - data
  - set
---
# Providers

Quote resolution lives in `getQuotes` in `server/src/routes/market.ts`. Crypto symbols hit Binance first. Everything else tries Nasdaq, then Yahoo batch quotes, then Yahoo chart quotes, then Stooq (capped at 20 remaining symbols). TradingView fundamentals fill P/E, EPS, yield, beta, and shares when Nasdaq left them empty.

## What works today

| Data | Path in code | Notes |
|---|---|---|
| Stock quotes | Nasdaq → Yahoo → Stooq | Nasdaq is US-oriented |
| Crypto quotes | Binance (known symbols) | CoinGecko used elsewhere for the board |
| Candles | Nasdaq chart → Yahoo → Stooq | Same US bias |
| Search | TradingView symbol search | Query sets `sort_by_country=US` |
| Screener / heatmap | `scanner.tradingview.com/america/scan` | Whole-US snapshot |
| Fundamentals | TradingView America scanner | `toTVExchange` maps unknown venues to NASDAQ |
| News | Yahoo RSS + Google News RSS | US region/lang |
| Macro | FRED | US yields / VIX |
| Options | Nasdaq → Yahoo | US listed options |

International search already appends Yahoo suffixes for several exchanges (Milan, Paris, London, HK, Tokyo, and others) in `EXCHANGE_SUFFIX` inside `server/src/providers/tradingview.ts`. **SET is not in that list.** There is no `.BK` mapping.

## SET gaps (from this code, not from SET docs)

1. Typing `PTT` will be sent to Nasdaq first. If Yahoo then runs on the bare symbol, it can hit the wrong listing instead of `PTT.BK`.
2. TradingView search prefers US (`sort_by_country=US`).
3. `toTVExchange` defaults anything it does not recognize to `NASDAQ`, so SET fundamentals would be requested under the wrong prefix.
4. Heatmap and screener call the America scanner only. Dual market should not reuse that endpoint for SET.
5. News RSS is `region=US&lang=en-US` and Google `gl=US`.

Yahoo itself can quote suffixes like `.BK` if we pass them through. The gap is routing and search, not necessarily a missing Yahoo client.

`getQuotes` and history skip Nasdaq for symbols with `=`, `.BK`, or a leading `^`, so futures like `CL=F` and FX like `XAUUSD=X` go to Yahoo. Thai association gold is a separate scrape in `goldtraders.ts`, not a quote symbol. See [Commodities](./commodities.md).

Planned SET behavior: [SET market](./set-market.md). Build order: [Roadmap](./roadmap.md).
