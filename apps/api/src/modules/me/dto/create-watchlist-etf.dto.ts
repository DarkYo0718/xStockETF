import { IsString, Length } from "class-validator";

export class CreateWatchlistEtfDto {
  @IsString()
  @Length(4, 10)
  code!: string;
}
