import { DataTimestamp } from "../components/data-timestamp";
import { DisclaimerCard } from "../components/disclaimer-card";
import { EtfTable } from "../components/etf-table";
import { StatCard } from "../components/stat-card";
import { getEtfs } from "../lib/api";

export default async function HomePage() {
  const res = await getEtfs({ assetClass: "ACTIVE_STOCK" });
  const top = res.data[0];

  return (
    <main style={{ display: "grid", gap: 24 }}>
      <section
        className="glass"
        style={{ borderRadius: 34, padding: 32, display: "grid", gap: 18 }}
      >
        <span className="pill">桌機優先的主動式 ETF 研究工作台</span>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.05, margin: 0 }}>
          把 ETF 清單、持股快照、折溢價與股票反查放進同一個決策桌面。
        </h1>
        <p style={{ margin: 0, maxWidth: 760, color: "var(--muted)", fontSize: 18 }}>
          首期聚焦公開首頁、ETF 清單、ETF 詳頁、股票詳頁與會員自選，強調資料時間戳、來源透明與研究效率。
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="pill" href="/etfs">
            進入 ETF 清單
          </a>
          <a className="pill" href="/watchlist">
            查看會員自選
          </a>
        </div>
        <DataTimestamp
          asOfDate={res.meta.asOfDate}
          source={res.meta.source}
          isEstimated={res.meta.isEstimated}
        />
      </section>

      <section className="grid-cards">
        <StatCard title="今日關注 ETF" value={top?.code ?? "-"} hint={top?.name} />
        <StatCard
          title="清單支援"
          value="搜尋 / 篩選 / 排序"
          hint="MVP 先完成桌機優先的比較體驗"
        />
        <StatCard
          title="資料標示"
          value="時間戳 + 免責"
          hint="所有淨值、折溢價、持股快照都會註明來源與披露日"
        />
      </section>

      <section style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28 }}>主動式 ETF 清單預覽</h2>
            <p style={{ color: "var(--muted)" }}>
              現在已接上每日更新的持股快照，清單會優先顯示最新披露日。
            </p>
          </div>
          <a href="/etfs" className="pill">
            看完整清單
          </a>
        </div>
        <EtfTable items={res.data} />
      </section>

      <DisclaimerCard />
    </main>
  );
}
