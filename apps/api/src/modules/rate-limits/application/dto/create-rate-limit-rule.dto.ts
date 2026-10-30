import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { RateLimitAlgorithm } from '../../domain/types/rate-limit.types';

export class CreateRateLimitRuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  limit: number;

  @IsInt()
  @Min(1)
  windowSeconds: number;

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
