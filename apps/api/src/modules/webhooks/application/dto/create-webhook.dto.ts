import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  url: string;

  @IsArray()
  @IsString({ each: true })
  events: string[];
}
