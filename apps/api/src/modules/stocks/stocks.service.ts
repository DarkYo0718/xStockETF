import { Injectable, NotFoundException } from "@nestjs/common";
import { activeEtfDataset } from "../../data/active-etf-dataset.js";

@Injectable()
export class StocksService {
  getMeta() {
    return {
      generatedAt: activeEtfDataset.generatedAt,
      source: activeEtfDataset.source
    };
  }

  async holders(ticker: string) {
    const result = activeEtfDataset.stockHolders[ticker];
    if (!result) {
      throw new NotFoundException(`Stock ${ticker} not found`);
    }

    return result;
  }
}
