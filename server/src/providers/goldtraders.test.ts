import { describe, expect, it } from "vitest";
import { parseGoldTradersHtml } from "./goldtraders.js";

const FIXTURE = `
<span id="DetailPlace_uc_goldprices1_lblAsTime"><b><font size="3">08/09/2569 เวลา 16:11 น. (ครั้งที่ 24)</font></b></span>
<span id="DetailPlace_uc_goldprices1_lblBLSell"><b><font color="Green">68,600.00</font></b></span>
<span id="DetailPlace_uc_goldprices1_lblBLBuy"><b><font color="Green">68,400.00</font></b></span>
<span id="DetailPlace_uc_goldprices1_lblOMSell"><b><font color="Green">69,400.00</font></b></span>
<span id="DetailPlace_uc_goldprices1_lblOMBuy"><b><font color="Green">67,037.52</font></b></span>
`;

describe("parseGoldTradersHtml", () => {
  it("reads 96.5% bar and jewelry buy/sell in THB per baht-weight", () => {
    const p = parseGoldTradersHtml(FIXTURE);
    expect(p.asOf).toBe("08/09/2569 เวลา 16:11 น. (ครั้งที่ 24)");
    expect(p.bar).toEqual({ sell: 68600, buy: 68400 });
    expect(p.jewelry).toEqual({ sell: 69400, buy: 67037.52 });
  });

  it("throws when required spans are missing", () => {
    expect(() => parseGoldTradersHtml("<html></html>")).toThrow(/goldtraders/);
  });
});
