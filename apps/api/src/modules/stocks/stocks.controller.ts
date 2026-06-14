import { Controller, Get, Param } from "@nestjs/common";
import { StocksService } from "./stocks.service.js";

@Controller("/api/v1/stocks")
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(":ticker/holders")
  async holders(@Param("ticker") ticker: string) {
    const data = await this.stocksService.holders(ticker.toUpperCase());
    const meta = this.stocksService.getMeta();
    return {
      data,
      meta: {
        generatedAt: meta.generatedAt,
        asOfDate: data.asOfDate,
        source: meta.source,
        isEstimated: false
      }
    };
  }
}
