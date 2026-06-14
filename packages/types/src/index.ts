export type AssetClass = "ACTIVE_STOCK" | "ACTIVE_BOND";
export type ActionType = "BUY" | "SELL" | "NEW" | "EXIT" | "HOLD";

export interface EnvelopeMeta {
  generatedAt: string;
  asOfDate?: string | null;
  source: string[];
  isEstimated?: boolean;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: EnvelopeMeta;
}

export interface EtfListItem {
  code: string;
  name: string;
  issuerName: string;
  assetClass: AssetClass;
  latestClose: number | null;
  premiumDiscountPct: number | null;
  latestNavDate: string | null;
}

export interface EtfHoldingItemView {
  ticker: string | null;
  stockName: string;
  weightPct: number;
  changeWeightPct: number | null;
  actionType: ActionType | null;
}

export interface EtfDetail {
  code: string;
  name: string;
  issuerName: string;
  benchmark: string | null;
  latestClose: number | null;
  estimatedNav: number | null;
  premiumDiscountPct: number | null;
  holdingsAsOfDate: string | null;
  sources: string[];
  holdings: EtfHoldingItemView[];
}

export interface StockHolderEtf {
  code: string;
  name: string;
  issuerName: string;
  weightPct: number;
  changeWeightPct: number | null;
  actionType: ActionType | null;
  holdingsAsOfDate: string | null;
}

export interface StockHoldersDetail {
  ticker: string;
  stockName: string;
  asOfDate: string | null;
  holderEtfs: StockHolderEtf[];
}

export interface WatchlistEtfItem {
  id: string;
  code: string;
  name: string;
  issuerName: string;
  createdAt: string;
}
