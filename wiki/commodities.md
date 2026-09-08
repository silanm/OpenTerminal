---
description: "GOLD / OIL widget: Thai GTA bar and jewelry, plus XAU, GLD, WTI, and Brent."
tags:
  - commodities
  - gold
  - oil
title: Commodities
---
# Commodities

One widget, sidebar label GOLD / OIL. Type `commodities`. It is on the default layout; if an old workspace is persisted, add it from the sidebar or hit RESET LAYOUT.

## What it shows

Thai gold from the Gold Traders Association classic site, parsed in `server/src/providers/goldtraders.ts`:

- Gold bar 96.5% buy / sell, THB per baht-weight
- Jewelry 96.5% buy / sell

Association update stamp is shown in the header. Sell is ขายออก (you pay this to buy). Buy is รับซื้อ (you get this if you sell).

Spot / ETF / futures via the existing quote path (`/api/commodities` then `getQuotes`):

| Row | Symbol |
|---|---|
| Gold spot | `XAUUSD=X` |
| Gold ETF | `GLD` |
| WTI crude | `CL=F` |
| Brent crude | `BZ=F` |

Click a Yahoo row to drive Chart / Quote. Futures and FX skip Nasdaq (`skipNasdaq` in `server/src/routes/market.ts`). Thai gold is not a ticker.

GLD still comes from Nasdaq. `XAUUSD=X`, `CL=F`, and `BZ=F` need Yahoo. If Yahoo is in a cooldown, those three rows can be empty while Thai gold and GLD still show.

## Out of scope

- Sparklines on the board
- Separate Gold vs Oil widgets
- Thai retail petrol prices
