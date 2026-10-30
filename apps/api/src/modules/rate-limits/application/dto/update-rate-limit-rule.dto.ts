import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { RateLimitAlgorithm } from '../../domain/types/rate-limit.types';

export class UpdateRateLimitRuleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  windowSeconds?: number;

  @IsOptional()
  @IsEnum(RateLimitAlgorithm)
  algorithm?: RateLimitAlgorithm;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
