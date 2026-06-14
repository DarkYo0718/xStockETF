import type {
  EtfDetail,
  EtfListItem,
  StockHoldersDetail,
  WatchlistEtfItem
} from "@xstocketf/types";

export const etfList: EtfListItem[] = [
  {
    code: "00981A",
    name: "主動統一台股增長",
    issuerName: "統一投信",
    assetClass: "ACTIVE_STOCK",
    latestClose: 30.6,
    premiumDiscountPct: 0.62,
    latestNavDate: "2026-06-12"
  },
  {
    code: "00982A",
    name: "主動群益台灣強棒",
    issuerName: "群益投信",
    assetClass: "ACTIVE_STOCK",
    latestClose: 18.43,
    premiumDiscountPct: -0.17,
    latestNavDate: "2026-06-12"
  },
  {
    code: "00990D",
    name: "主動全球債收益",
    issuerName: "凱基投信",
    assetClass: "ACTIVE_BOND",
    latestClose: 14.22,
    premiumDiscountPct: 0.05,
    latestNavDate: "2026-06-12"
  }
];

export const etfDetails: Record<string, EtfDetail> = {
  "00981A": {
    code: "00981A",
    name: "主動統一台股增長",
    issuerName: "統一投信",
    benchmark: "臺灣證券交易所發行量加權股價指數",
    latestClose: 30.6,
    estimatedNav: 30.41,
    premiumDiscountPct: 0.62,
    holdingsAsOfDate: "2026-06-12",
    sources: ["issuer.official", "twse.openapi"],
    holdings: [
      {
        ticker: "2330",
        stockName: "台積電",
        weightPct: 9.75,
        changeWeightPct: 0.35,
        actionType: "BUY"
      },
      {
        ticker: "2383",
        stockName: "台光電",
        weightPct: 7.64,
        changeWeightPct: -0.12,
        actionType: "SELL"
      },
      {
        ticker: "2454",
        stockName: "聯發科",
        weightPct: 6.21,
        changeWeightPct: 0.08,
        actionType: "HOLD"
      }
    ]
  },
  "00982A": {
    code: "00982A",
    name: "主動群益台灣強棒",
    issuerName: "群益投信",
    benchmark: "臺灣永續高股息策略指數",
    latestClose: 18.43,
    estimatedNav: 18.46,
    premiumDiscountPct: -0.17,
    holdingsAsOfDate: "2026-06-12",
    sources: ["issuer.official"],
    holdings: [
      {
        ticker: "2317",
        stockName: "鴻海",
        weightPct: 8.45,
        changeWeightPct: 0.21,
        actionType: "BUY"
      },
      {
        ticker: "2882",
        stockName: "國泰金",
        weightPct: 7.32,
        changeWeightPct: null,
        actionType: "HOLD"
      }
    ]
  },
  "00990D": {
    code: "00990D",
    name: "主動全球債收益",
    issuerName: "凱基投信",
    benchmark: "Bloomberg Global Aggregate Bond Index",
    latestClose: 14.22,
    estimatedNav: 14.21,
    premiumDiscountPct: 0.05,
    holdingsAsOfDate: "2026-06-12",
    sources: ["issuer.official", "internal.calc"],
    holdings: [
      {
        ticker: "UST10Y",
        stockName: "US Treasury 10Y",
        weightPct: 12.3,
        changeWeightPct: -0.4,
        actionType: "SELL"
      }
    ]
  }
};

export const stockHolders: Record<string, StockHoldersDetail> = {
  "2330": {
    ticker: "2330",
    stockName: "台積電",
    asOfDate: "2026-06-12",
    holderEtfs: [
      {
        code: "00981A",
        name: "主動統一台股增長",
        issuerName: "統一投信",
        weightPct: 9.75,
        changeWeightPct: 0.35,
        actionType: "BUY",
        holdingsAsOfDate: "2026-06-12"
      }
    ]
  },
  "2317": {
    ticker: "2317",
    stockName: "鴻海",
    asOfDate: "2026-06-12",
    holderEtfs: [
      {
        code: "00982A",
        name: "主動群益台灣強棒",
        issuerName: "群益投信",
        weightPct: 8.45,
        changeWeightPct: 0.21,
        actionType: "BUY",
        holdingsAsOfDate: "2026-06-12"
      }
    ]
  }
};

export const defaultWatchlist: WatchlistEtfItem[] = [
  {
    id: "wl-00981a",
    code: "00981A",
    name: "主動統一台股增長",
    issuerName: "統一投信",
    createdAt: "2026-06-14T03:13:10.111Z"
  }
];
