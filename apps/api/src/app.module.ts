import { Module } from "@nestjs/common";
import { EtfsModule } from "./modules/etfs/etfs.module.js";
import { StocksModule } from "./modules/stocks/stocks.module.js";
import { MeModule } from "./modules/me/me.module.js";

@Module({
  imports: [EtfsModule, StocksModule, MeModule]
})
export class AppModule {}
