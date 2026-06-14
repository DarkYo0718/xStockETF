import { DataTimestamp } from "../../components/data-timestamp";
import { DisclaimerCard } from "../../components/disclaimer-card";
import { EtfTable } from "../../components/etf-table";
import { getEtfs } from "../../lib/api";

export default async function EtfsPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; assetClass?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const res = await getEtfs({
    q: params.q,
    assetClass: params.assetClass
  });

  return (
    <main style={{ display: "grid", gap: 22 }}>
      <section className="glass" style={{ borderRadius: 32, padding: 28 }}>
        <h1 style={{ marginTop: 0, marginBottom: 12, fontSize: 40 }}>主動式 ETF 清單</h1>
        <p style={{ color: "var(--muted)", maxWidth: 760 }}>
          文件要求的搜尋 / 篩選 / 排序入口先以 query 參數形式落地。後續可改成 client-side controls 並接真實 API。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0" }}>
          <a href="/etfs" className="pill">
            全部
          </a>
          <a href="/etfs?assetClass=ACTIVE_STOCK" className="pill">
            股票型
          </a>
          <a href="/etfs?assetClass=ACTIVE_BOND" className="pill">
            債券型
          </a>
          <a href="/etfs?q=%E7%B5%B1%E4%B8%80" className="pill">
            搜尋: 統一
          </a>
        </div>
        <DataTimestamp
          asOfDate={res.meta.asOfDate}
          source={res.meta.source}
          isEstimated={res.meta.isEstimated}
        />
      </section>

      <EtfTable items={res.data} />
      <DisclaimerCard />
    </main>
  );
}
