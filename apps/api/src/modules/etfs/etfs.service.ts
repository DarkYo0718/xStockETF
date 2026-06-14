import { Injectable, NotFoundException } from "@nestjs/common";
import { activeEtfDataset } from "../../data/active-etf-dataset.js";
import { ListEtfsDto } from "./dto/list-etfs.dto.js";

@Injectable()
export class EtfsService {
  getMeta() {
    return {
      generatedAt: activeEtfDataset.generatedAt,
      source: activeEtfDataset.source
    };
  }

  async list(query: ListEtfsDto) {
    return activeEtfDataset.etfList
      .filter((item) => {
        if (query.assetClass && item.assetClass !== query.assetClass) {
          return false;
        }

        if (!query.q) {
          return true;
        }

        const needle = query.q.toLowerCase();
        return (
          item.code.toLowerCase().includes(needle) ||
          item.name.toLowerCase().includes(needle) ||
          item.issuerName.toLowerCase().includes(needle)
        );
      })
      .slice(0, 200);
  }

  async detail(code: string) {
    const detail = activeEtfDataset.etfDetails[code];
    if (!detail) {
      throw new NotFoundException(`ETF ${code} not found`);
    }

    return detail;
  }
}
