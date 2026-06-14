import { DataTimestamp } from "../../../components/data-timestamp";
import { DisclaimerCard } from "../../../components/disclaimer-card";
import { StatCard } from "../../../components/stat-card";
import { getStockHolders } from "../../../lib/api";

export default async function StockDetailPage({
  params
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const res = await getStockHolders(ticker);

  return (
    <main style={{ display: "grid", gap: 22 }}>
      <section className="glass" style={{ borderRadius: 32, padding: 28 }}>
        <span className="pill">股票反查</span>
        <h1 style={{ fontSize: 42, marginBottom: 8 }}>
          {res.data.ticker} {res.data.stockName}
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          從個股視角回看有哪些主動式 ETF 正在持有，以及最近加減碼方向。
        </p>
        <DataTimestamp asOfDate={res.meta.asOfDate} source={res.meta.source} />
      </section>

      <section className="grid-cards">
        <StatCard title="持有 ETF 數量" value={res.data.holderEtfs.length} />
        <StatCard
          title="最近資料日"
          value={res.data.asOfDate ?? "-"}
          hint="依最近一次持股快照回推"
        />
        <StatCard
          title="研究入口"
          value="ETF -> 股票"
          hint="符合文件建議的桌機研究流程"
        />
      </section>

      <section
        className="glass"
        style={{ borderRadius: 28, overflow: "hidden", border: "1px solid var(--line)" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 760 }}>
            <thead style={{ background: "rgba(255,255,255,0.7)" }}>
              <tr>
                {["ETF", "名稱", "發行人", "權重", "變化", "動作", "資料日"].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "16px 18px",
                      fontSize: 14,
                      color: "var(--muted)",
                      borderBottom: "1px solid var(--line)"
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {res.data.holderEtfs.map((item) => (
                <tr key={item.code}>
                  <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                    <a href={`/etfs/${item.code}`} style={{ fontWeight: 700 }}>
                      {item.code}
                    </a>
                  </td>
                  <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                    {item.name}
                  </td>
                  <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                    {item.issuerName}
                  </td>
                  <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                    {item.weightPct.toFixed(2)}%
                  </td>
                  <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                    {item.changeWeightPct != null
                      ? `${item.changeWeightPct.toFixed(2)}%`
                      : "-"}
                  </td>
                  <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                    {item.actionType ?? "-"}
                  </td>
                  <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                    {item.holdingsAsOfDate ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DisclaimerCard />
    </main>
  );
}
