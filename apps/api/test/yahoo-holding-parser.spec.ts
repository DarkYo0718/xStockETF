import { parseYahooHoldingHtml } from "../src/lib/yahoo-holding-parser.js";

describe("parseYahooHoldingHtml", () => {
  it("extracts top holdings and tickers from Yahoo holding markup", () => {
    const html = `
      <div id="main-2-QuoteHolding-Proxy"><div class="grid-item item-span-6 break-mobile default-row-gap"><ul class="Bxz(bb) Bgc($c-light-gray) Bdrs(8px) P(20px)"><li class="Pb(12px)"><div class="D(f) Jc(sb) Ai(c) C($c-link-text)"><h2 class="Fz(20px)--mobile Fw(b) Fz(20px) Lh(28px)">前十大持股</h2><span class="C(#6e7780) As(fe) Fz(12px)"><time datatime="2026/05/01"><span class="D(n)--mobile"><span>資料時間：</span></span><span>2026/05/01</span></time></span></div></li><li class="D(f) Ai(c) Jc(sb) C($c-link-text) Fz(16px) Lh(24px) Pt(8px) Pb(7px) Bdbs(s) Bdbw(1px) Bdbc($bd-primary-divider)"><div class="D(f) Ai(c)"><div class="Fx(n) W(28px) H(28px) D(f) Ai(c) Jc(c) Fz(20px) Fw(b) C($c-secondary-text) Mend(4px)">1.</div>台積電</div><div class="Fx(n) Pstart(16px)">8.19%</div></li><li class="D(f) Ai(c) Jc(sb) C($c-link-text) Fz(16px) Lh(24px) Pt(8px) Pb(7px) Bdbs(s) Bdbw(1px) Bdbc($bd-primary-divider)"><div class="D(f) Ai(c)"><div class="Fx(n) W(28px) H(28px) D(f) Ai(c) Jc(c) Fz(20px) Fw(b) C($c-secondary-text) Mend(4px)">2.</div>台達電</div><div class="Fx(n) Pstart(16px)">6.26%</div></li></ul></div></div>
      <script>
        window.__DATA__ = {
          "quotes":[
            {"name":"台積電","symbol":"2330.TW"},
            {"symbolName":"台達電","symbol":"2308.TW"}
          ]
        };
      </script>
    `;

    expect(parseYahooHoldingHtml(html)).toEqual({
      holdingsAsOfDate: "2026-05-01",
      holdings: [
        { ticker: "2330", stockName: "台積電", weightPct: 8.19 },
        { ticker: "2308", stockName: "台達電", weightPct: 6.26 }
      ]
    });
  });
});
