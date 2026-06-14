import type { EtfListItem } from "@xstocketf/types";

export function EtfTable({ items }: { items: EtfListItem[] }) {
  return (
    <div
      className="glass"
      style={{ borderRadius: 28, overflow: "hidden", border: "1px solid var(--line)" }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 760 }}>
          <thead style={{ background: "rgba(255,255,255,0.7)" }}>
            <tr>
              {["ETF", "名稱", "發行人", "類型", "最新收盤", "折溢價", "資料日"].map(
                (header) => (
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
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
                  {item.assetClass === "ACTIVE_STOCK" ? "股票型" : "債券型"}
                </td>
                <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                  {item.latestClose ?? "-"}
                </td>
                <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                  {item.premiumDiscountPct != null
                    ? `${item.premiumDiscountPct.toFixed(2)}%`
                    : "-"}
                </td>
                <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                  {item.latestNavDate ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
