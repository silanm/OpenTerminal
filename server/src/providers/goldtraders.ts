const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export const GOLDTRADERS_URL = "https://classic.goldtraders.or.th/";

export type ThaiGoldSide = { buy: number; sell: number };

export type ThaiGoldPrices = {
  asOf: string;
  bar: ThaiGoldSide;
  jewelry: ThaiGoldSide;
};

function spanText(html: string, id: string): string | null {
  const re = new RegExp(`id="${id}"[^>]*>([\\s\\S]*?)</span>`, "i");
  const m = html.match(re);
  if (!m) return null;
  const text = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text || null;
}

function parseBaht(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function parseGoldTradersHtml(html: string): ThaiGoldPrices {
  const asOf = spanText(html, "DetailPlace_uc_goldprices1_lblAsTime");
  const barSell = parseBaht(spanText(html, "DetailPlace_uc_goldprices1_lblBLSell"));
  const barBuy = parseBaht(spanText(html, "DetailPlace_uc_goldprices1_lblBLBuy"));
  const jewelrySell = parseBaht(spanText(html, "DetailPlace_uc_goldprices1_lblOMSell"));
  const jewelryBuy = parseBaht(spanText(html, "DetailPlace_uc_goldprices1_lblOMBuy"));
  if (!asOf || barSell == null || barBuy == null || jewelrySell == null || jewelryBuy == null) {
    throw new Error("goldtraders: missing price spans");
  }
  return {
    asOf,
    bar: { sell: barSell, buy: barBuy },
    jewelry: { sell: jewelrySell, buy: jewelryBuy },
  };
}

export async function latest(): Promise<ThaiGoldPrices> {
  const res = await fetch(GOLDTRADERS_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`goldtraders ${res.status}`);
  return parseGoldTradersHtml(await res.text());
}
