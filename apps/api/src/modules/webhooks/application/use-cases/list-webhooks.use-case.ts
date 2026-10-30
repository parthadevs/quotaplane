import { Injectable } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories/webhook.repository';
import { WebhookEntity } from '../../domain/entities/webhook.entity';

@Injectable()
export class ListWebhooksUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(organizationId: string): Promise<WebhookEntity[]> {
    return this.webhookRepository.findByOrganizationId(organizationId);
  }
}
