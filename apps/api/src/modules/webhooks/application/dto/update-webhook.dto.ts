import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWebhookDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  events?: string[];
}
