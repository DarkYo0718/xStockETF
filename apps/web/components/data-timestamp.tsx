interface DataTimestampProps {
  asOfDate?: string | null;
  source: string[];
  isEstimated?: boolean;
}

export function DataTimestamp({
  asOfDate,
  source,
  isEstimated
}: DataTimestampProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        color: "var(--muted)",
        fontSize: 14
      }}
    >
      <span className="pill">資料日：{asOfDate ?? "-"}</span>
      <span className="pill">來源：{source.join(" / ")}</span>
      {isEstimated ? <span className="pill">含估計值</span> : null}
    </div>
  );
}
