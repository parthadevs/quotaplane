import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { QuotaPeriod } from '../../domain/types/quota.types';

export class UpdateQuotaDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @IsEnum(QuotaPeriod)
  period?: QuotaPeriod;

  @IsOptional()
  @IsInt()
  @Min(1)
  defaultCost?: number;
}
