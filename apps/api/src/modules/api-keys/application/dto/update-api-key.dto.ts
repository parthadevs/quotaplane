import { IsString, IsOptional, IsInt, Min, IsIn, IsDateString } from 'class-validator';
import { ApiKeyStatus } from '../../domain/types/api-key.types';

export class UpdateApiKeyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn([ApiKeyStatus.ACTIVE, ApiKeyStatus.REVOKED])
  status?: ApiKeyStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  weight?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
