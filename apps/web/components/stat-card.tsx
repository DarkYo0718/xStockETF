import { ReactNode } from "react";

export function StatCard({
  title,
  value,
  tone = "default",
  hint
}: {
  title: string;
  value: ReactNode;
  tone?: "default" | "positive" | "negative";
  hint?: string;
}) {
  const color =
    tone === "positive"
      ? "var(--positive)"
      : tone === "negative"
        ? "var(--negative)"
        : "var(--ink)";

  return (
    <div
      className="glass"
      style={{ borderRadius: 26, padding: 20, minHeight: 144 }}
    >
      <div style={{ color: "var(--muted)", fontSize: 14 }}>{title}</div>
      <div style={{ marginTop: 14, fontSize: 34, fontWeight: 700, color }}>
        {value}
      </div>
      {hint ? (
        <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
