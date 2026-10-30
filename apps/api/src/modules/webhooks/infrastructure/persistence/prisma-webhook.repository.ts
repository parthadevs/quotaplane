import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { WebhookRepository } from '../../domain/repositories/webhook.repository';
import { WebhookEntity } from '../../domain/entities/webhook.entity';
import { WebhookMapper } from './mappers/webhook.mapper';

@Injectable()
export class PrismaWebhookRepository extends WebhookRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<WebhookEntity | null> {
    const model = await this.prisma.webhook.findUnique({ where: { id } });
    return model ? WebhookMapper.toDomain(model) : null;
  }

  async findByOrganizationId(organizationId: string): Promise<WebhookEntity[]> {
    const models = await this.prisma.webhook.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(WebhookMapper.toDomain);
  }

  async create(webhook: WebhookEntity): Promise<WebhookEntity> {
    const model = await this.prisma.webhook.create({
      data: {
        id: webhook.id,
        organizationId: webhook.organizationId,
        name: webhook.name,
        url: webhook.url,
        secret: webhook.secret,
        status: webhook.status,
        events: webhook.events,
        createdAt: webhook.createdAt,
        updatedAt: webhook.updatedAt,
      },
    });
    return WebhookMapper.toDomain(model);
  }

  async update(webhook: WebhookEntity): Promise<WebhookEntity> {
    const model = await this.prisma.webhook.update({
      where: { id: webhook.id },
      data: {
        name: webhook.name,
        url: webhook.url,
        secret: webhook.secret,
        status: webhook.status,
        events: webhook.events,
        updatedAt: new Date(),
      },
    });
    return WebhookMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.webhook.delete({ where: { id } });
  }

  async existsByName(organizationId: string, name: string): Promise<boolean> {
    const count = await this.prisma.webhook.count({
      where: { organizationId, name },
    });
    return count > 0;
  }

  async findByEvent(organizationId: string, event: string): Promise<WebhookEntity[]> {
    const models = await this.prisma.webhook.findMany({
      where: {
        organizationId,
        events: { has: event },
      },
    });
    return models.map(WebhookMapper.toDomain);
  }
}
