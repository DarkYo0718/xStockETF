import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateWatchlistEtfDto } from "./dto/create-watchlist-etf.dto.js";
import { MeService } from "./me.service.js";

@Controller("/api/v1/me")
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get("watchlist/etfs")
  async listEtfWatchlist() {
    const data = await this.meService.getEtfWatchlist();
    return {
      data,
      meta: {
        generatedAt: new Date().toISOString(),
        source: ["mock.seed", "app.read"],
        isEstimated: false
      }
    };
  }

  @Post("watchlist/etfs")
  async addEtfWatchlist(@Body() body: CreateWatchlistEtfDto) {
    const item = await this.meService.addEtfWatchlist(body.code);
    return {
      data: {
        ok: true,
        watchlistItemId: item.id
      },
      meta: {
        generatedAt: new Date().toISOString(),
        source: ["app.write"],
        isEstimated: false
      }
    };
  }
}
