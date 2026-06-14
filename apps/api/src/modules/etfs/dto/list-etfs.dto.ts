import { IsBooleanString, IsIn, IsOptional, IsString } from "class-validator";

export class ListEtfsDto {
  @IsOptional()
  @IsBooleanString()
  active?: string;

  @IsOptional()
  @IsIn(["ACTIVE_STOCK", "ACTIVE_BOND"])
  assetClass?: "ACTIVE_STOCK" | "ACTIVE_BOND";

  @IsOptional()
  @IsString()
  q?: string;
}
