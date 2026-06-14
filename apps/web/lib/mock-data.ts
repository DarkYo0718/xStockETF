import type {
  ApiEnvelope,
  EtfDetail,
  EtfListItem,
  StockHoldersDetail,
  WatchlistEtfItem
} from "@xstocketf/types";

const baseMeta = {
  generatedAt: "2026-06-14T00:00:00.000Z",
  source: ["mock.seed", "web.fallback"]
};

export const fallbackEtfs: ApiEnvelope<EtfListItem[]> = {
  data: [
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
  ],
  meta: {
    ...baseMeta,
    asOfDate: "2026-06-12",
    isEstimated: true
  }
};

export const fallbackEtfDetails: Record<string, ApiEnvelope<EtfDetail>> = {
  "00981A": {
    data: {
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
        }
      ]
    },
    meta: {
      ...baseMeta,
      asOfDate: "2026-06-12",
      source: ["issuer.official", "twse.openapi"],
      isEstimated: true
    }
  },
  "00982A": {
    data: {
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
        }
      ]
    },
    meta: {
      ...baseMeta,
      asOfDate: "2026-06-12",
      source: ["issuer.official"],
      isEstimated: true
    }
  }
};

export const fallbackStockHolders: Record<string, ApiEnvelope<StockHoldersDetail>> = {
  "2330": {
    data: {
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
    meta: {
      ...baseMeta,
      asOfDate: "2026-06-12",
      isEstimated: false
    }
  }
};

export const fallbackWatchlist: ApiEnvelope<WatchlistEtfItem[]> = {
  data: [
    {
      id: "wl-00981a",
      code: "00981A",
      name: "主動統一台股增長",
      issuerName: "統一投信",
      createdAt: "2026-06-14T03:13:10.111Z"
    }
  ],
  meta: {
    ...baseMeta,
    isEstimated: false
  }
};
