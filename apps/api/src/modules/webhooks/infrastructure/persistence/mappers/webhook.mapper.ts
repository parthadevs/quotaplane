import { Webhook as PrismaWebhook } from '@prisma/client';
import { WebhookEntity } from '../../../domain/entities/webhook.entity';

export class WebhookMapper {
  static toDomain(model: PrismaWebhook): WebhookEntity {
    return WebhookEntity.fromPrisma(model);
  }
}
