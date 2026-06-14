import { Injectable, NotFoundException } from "@nestjs/common";
import { activeEtfDataset } from "../../data/active-etf-dataset.js";
import { defaultWatchlist } from "../../data/mock-data.js";

@Injectable()
export class MeService {
  private readonly watchlist = [...defaultWatchlist];

  async getEtfWatchlist() {
    return this.watchlist;
  }

  async addEtfWatchlist(code: string) {
    const upperCode = code.toUpperCase();
    const found = activeEtfDataset.etfDetails[upperCode];
    if (!found) {
      throw new NotFoundException(`ETF ${upperCode} not found`);
    }

    const existing = this.watchlist.find((item) => item.code === upperCode);
    if (existing) {
      return existing;
    }

    const record = {
      id: `wl-${upperCode.toLowerCase()}`,
      code: upperCode,
      name: found.name,
      issuerName: found.issuerName,
      createdAt: new Date().toISOString()
    };

    this.watchlist.push(record);
    return record;
  }
}
