import { DataTimestamp } from "../../components/data-timestamp";
import { DisclaimerCard } from "../../components/disclaimer-card";
import { getWatchlistEtfs } from "../../lib/api";

export default async function WatchlistPage() {
  const res = await getWatchlistEtfs();

  return (
    <main style={{ display: "grid", gap: 22 }}>
      <section className="glass" style={{ borderRadius: 32, padding: 28 }}>
        <span className="pill">會員自選</span>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>我的 ETF 關注清單</h1>
        <p style={{ color: "var(--muted)", marginTop: 0, maxWidth: 760 }}>
          目前以 mock 會員資料示範 watchlist 流程，後續可接 SSO、權限同步與提醒規則。
        </p>
        <DataTimestamp source={res.meta.source} asOfDate={null} />
      </section>

      <section
        className="glass"
        style={{ borderRadius: 28, overflow: "hidden", border: "1px solid var(--line)" }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 640 }}>
            <thead style={{ background: "rgba(255,255,255,0.7)" }}>
              <tr>
                {["ETF", "名稱", "發行人", "加入時間"].map((header) => (
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
              {res.data.map((item) => (
                <tr key={item.id}>
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
                    {new Date(item.createdAt).toLocaleString("zh-TW")}
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
