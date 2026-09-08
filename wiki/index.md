---
title: OpenTerminal wiki
description: "Home for the dual-market SET + US fork: architecture, Thai overlay, portfolio rules, and personal holdings."
tags:
  - home
  - set
  - dual-market
---
# OpenTerminal wiki

This knowledge base is the working notes for a personal fork of OpenTerminal. US stocks and crypto stay. Thai SET and mai sit beside them as an equal market, not a hidden extra.

The public README still describes the upstream US-first app. SET-specific work lives here until it actually ships.

## What this fork is for

- Dual market in one terminal: Thai and US (plus crypto), switchable once the UI exists.
- Personal tracker: SET quotes, charts, and search; THB portfolio; dividends and XD dates; Thai news; gold and oil.
- Out of the first cut: SET heatmap and screener, multiple accounts, FX conversion.

Holdings and tracker rules are in-repo on [Holdings](./holdings.md), by choice.

## Pages

- [Architecture](./architecture.md) — web, API, cache, SQLite, widgets
- [Providers](./providers.md) — current fallback chains and SET gaps
- [SET market](./set-market.md) — quotes, charts, search for Thai tickers
- [Commodities](./commodities.md) — Thai gold, GLD, XAU, WTI, Brent
- [News](./news.md) — US RSS today, Thai sources next
- [Portfolio](./portfolio.md) — THB lots, cost, fees, dividends
- [Holdings](./holdings.md) — names you follow and tracker rules
- [Roadmap](./roadmap.md) — build order

## How to use this wiki

When we add SET support, update the matching page in the same change. If a fact is not in this repo yet, say so on the page instead of guessing an API.
