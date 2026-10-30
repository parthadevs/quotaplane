import { IsInt, IsOptional, Min } from 'class-validator';

export class CheckQuotaDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  cost?: number;
}
