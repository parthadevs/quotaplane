import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories/webhook.repository';
import { WebhookEntity } from '../../domain/entities/webhook.entity';
import { UpdateWebhookDto } from '../dto/update-webhook.dto';

@Injectable()
export class UpdateWebhookUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(organizationId: string, webhookId: string, dto: UpdateWebhookDto): Promise<WebhookEntity> {
    const webhook = await this.webhookRepository.findById(webhookId);
    if (!webhook || webhook.organizationId !== organizationId) {
      throw new NotFoundException('Webhook not found');
    }

    const updated = WebhookEntity.create({
      id: webhook.id,
      organizationId: webhook.organizationId,
      name: dto.name ?? webhook.name,
      url: dto.url ?? webhook.url,
      secret: webhook.secret,
      status: webhook.status,
      events: dto.events ?? webhook.events,
      createdAt: webhook.createdAt,
      updatedAt: new Date(),
    });

    return this.webhookRepository.update(updated);
  }
}
