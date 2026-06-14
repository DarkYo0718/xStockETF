import type { EtfDetail, EtfListItem, StockHoldersDetail } from "@xstocketf/types";
import { generatedActiveEtfDataset } from "./generated/active-etf-snapshots.js";

export interface ActiveEtfDataset {
  generatedAt: string;
  source: string[];
  etfList: EtfListItem[];
  etfDetails: Record<string, EtfDetail>;
  stockHolders: Record<string, StockHoldersDetail>;
}

export const activeEtfDataset: ActiveEtfDataset = generatedActiveEtfDataset;
