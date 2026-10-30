import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhookRepository } from '../../domain/repositories/webhook.repository';

@Injectable()
export class DeleteWebhookUseCase {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async execute(organizationId: string, webhookId: string): Promise<void> {
    const webhook = await this.webhookRepository.findById(webhookId);
    if (!webhook || webhook.organizationId !== organizationId) {
      throw new NotFoundException('Webhook not found');
    }
    await this.webhookRepository.delete(webhookId);
  }
}
