import { DataTimestamp } from "../../../components/data-timestamp";
import { DisclaimerCard } from "../../../components/disclaimer-card";
import { HoldingTable } from "../../../components/holding-table";
import { StatCard } from "../../../components/stat-card";
import { getEtfDetail } from "../../../lib/api";

export default async function EtfDetailPage({
  params
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const res = await getEtfDetail(code);
  const premium = res.data.premiumDiscountPct ?? 0;

  return (
    <main style={{ display: "grid", gap: 22 }}>
      <section className="glass" style={{ borderRadius: 32, padding: 28 }}>
        <span className="pill">{res.data.code}</span>
        <h1 style={{ fontSize: 42, marginBottom: 8 }}>{res.data.name}</h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          發行人：{res.data.issuerName} | Benchmark：{res.data.benchmark ?? "無"}
        </p>
        <DataTimestamp
          asOfDate={res.meta.asOfDate}
          source={res.meta.source}
          isEstimated={res.meta.isEstimated}
        />
      </section>

      <section className="grid-cards">
        <StatCard title="最新收盤價" value={res.data.latestClose ?? "-"} />
        <StatCard title="估計淨值" value={res.data.estimatedNav ?? "-"} />
        <StatCard
          title="折溢價"
          value={`${premium.toFixed(2)}%`}
          tone={premium >= 0 ? "positive" : "negative"}
          hint="以市價對估計淨值推算"
        />
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 8, fontSize: 28 }}>最新持股快照</h2>
          <p style={{ color: "var(--muted)" }}>
            目前顯示最近一次披露快照，後續可延伸歷史操作日報與持股異動視圖。
          </p>
        </div>
        <HoldingTable items={res.data.holdings} />
      </section>

      <DisclaimerCard />
    </main>
  );
}
