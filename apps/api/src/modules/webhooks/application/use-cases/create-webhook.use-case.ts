import { Injectable, ConflictException } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories/webhook.repository';
import { WebhookEntity } from '../../domain/entities/webhook.entity';
import { CreateWebhookDto } from '../dto/create-webhook.dto';
import { WebhookStatus } from '../../domain/types/webhook.types';
import * as crypto from 'crypto';

@Injectable()
export class CreateWebhookUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(organizationId: string, dto: CreateWebhookDto): Promise<WebhookEntity> {
    const exists = await this.webhookRepository.existsByName(organizationId, dto.name);
    if (exists) {
      throw new ConflictException('Webhook with this name already exists in organization');
    }

    const secret = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const webhook = WebhookEntity.create({
      id: crypto.randomUUID(),
      organizationId,
      name: dto.name,
      url: dto.url,
      secret,
      status: WebhookStatus.ACTIVE,
      events: dto.events,
      createdAt: now,
      updatedAt: now,
    });

    return this.webhookRepository.create(webhook);
  }
}
