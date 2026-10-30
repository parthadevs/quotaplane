import { WebhookEntity } from '../../domain/entities/webhook.entity';
import { WebhookStatus } from '../../domain/types/webhook.types';

export class WebhookResponseDto {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly url: string,
    public readonly status: WebhookStatus,
    public readonly events: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromEntity(entity: WebhookEntity): WebhookResponseDto {
    return new WebhookResponseDto(
      entity.id,
      entity.organizationId,
      entity.name,
      entity.url,
      entity.status,
      entity.events,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
