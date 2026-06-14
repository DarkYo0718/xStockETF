import type { EtfHoldingItemView } from "@xstocketf/types";

export function HoldingTable({ items }: { items: EtfHoldingItemView[] }) {
  return (
    <div
      className="glass"
      style={{ borderRadius: 28, overflow: "hidden", border: "1px solid var(--line)" }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 680 }}>
          <thead style={{ background: "rgba(255,255,255,0.7)" }}>
            <tr>
              {["股票", "權重", "權重變化", "動作"].map((header) => (
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
            {items.map((item) => (
              <tr key={`${item.ticker ?? "unknown"}-${item.stockName}`}>
                <td style={{ padding: "18px", borderBottom: "1px solid var(--line)" }}>
                  {item.ticker ? (
                    <a href={`/stocks/${item.ticker}`} style={{ fontWeight: 700 }}>
                      {item.ticker} {item.stockName}
                    </a>
                  ) : (
                    <span style={{ fontWeight: 700 }}>{item.stockName}</span>
                  )}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
