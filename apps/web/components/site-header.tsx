export function SiteHeader() {
  return (
    <header
      className="glass"
      style={{
        borderRadius: 28,
        padding: "18px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24
      }}
    >
      <a href="/" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>
        xStockETF
      </a>
      <nav style={{ display: "flex", gap: 18, color: "var(--muted)", flexWrap: "wrap" }}>
        <a href="/etfs">ETF 清單</a>
        <a href="/stocks/2330">股票反查</a>
        <a href="/watchlist">自選</a>
      </nav>
    </header>
  );
}
