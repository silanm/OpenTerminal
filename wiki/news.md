---
title: News
description: Current US RSS aggregation and what a Thai news path needs.
tags:
  - news
  - set
---
# News

`server/src/providers/news.ts` fetches RSS and de-duplicates by normalized title.

- Per-symbol: Yahoo Finance headline RSS with `region=US&lang=en-US`.
- Global: Google News RSS with `hl=en-US&gl=US&ceid=US:en`.
- Market route also requests `symbol + " stock"` as a second query.

That stack can still return some Thai-company headlines in English if Yahoo has them, but it is not a Thai news desk.

## Thai news (v1)

Add RSS (or another documented public feed) for:

- SET / company filings style headlines
- Thai business press (English or Thai; we have not picked outlets yet)

Do not hardcode feed URLs on this page until we fetch and ingest a working feed. When we add one, put the captured example under a sources page and link it from here.

## Dual-market behavior

- `.BK` symbols should query Thai-oriented feeds, not only `region=US`.
- US symbols keep the current Yahoo/Google path.
- The news widget already has symbol vs global. A later control can pick market, but v1 can infer from the suffix.

Related: [SET market](./set-market.md), [Roadmap](./roadmap.md).
