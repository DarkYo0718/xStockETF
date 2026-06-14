import { Controller, Get, Param, Query } from "@nestjs/common";
import { ListEtfsDto } from "./dto/list-etfs.dto.js";
import { EtfsService } from "./etfs.service.js";

@Controller("/api/v1/etfs")
export class EtfsController {
  constructor(private readonly etfsService: EtfsService) {}

  @Get()
  async list(@Query() query: ListEtfsDto) {
    const data = await this.etfsService.list(query);
    const meta = this.etfsService.getMeta();
    return {
      data,
      meta: {
        generatedAt: meta.generatedAt,
        asOfDate: data[0]?.latestNavDate ?? null,
        source: meta.source,
        isEstimated: false
      }
    };
  }

  @Get(":code")
  async detail(@Param("code") code: string) {
    const data = await this.etfsService.detail(code.toUpperCase());
    const meta = this.etfsService.getMeta();
    return {
      data,
      meta: {
        generatedAt: meta.generatedAt,
        asOfDate: data.holdingsAsOfDate,
        source: data.sources,
        isEstimated: false
      }
    };
  }
}
