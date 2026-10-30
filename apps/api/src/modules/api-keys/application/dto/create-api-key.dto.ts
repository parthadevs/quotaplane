import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsDateString } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  weight?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
