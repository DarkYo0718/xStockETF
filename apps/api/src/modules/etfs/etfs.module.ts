import { Module } from "@nestjs/common";
import { EtfsController } from "./etfs.controller.js";
import { EtfsService } from "./etfs.service.js";

@Module({
  controllers: [EtfsController],
  providers: [EtfsService],
  exports: [EtfsService]
})
export class EtfsModule {}
