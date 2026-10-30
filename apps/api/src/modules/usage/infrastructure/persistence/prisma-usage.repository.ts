import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { UsageRepository } from '../../domain/repositories/usage.repository';
import { UsageRecordEntity } from '../../domain/entities/usage-record.entity';
import { UsageMapper } from './mappers/usage.mapper';

@Injectable()
export class PrismaUsageRepository extends UsageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<UsageRecordEntity | null> {
    const model = await this.prisma.usageRecord.findUnique({ where: { id } });
    return model ? UsageMapper.toDomain(model) : null;
  }

  async findByOrganizationId(organizationId: string, options?: { limit?: number; offset?: number }): Promise<UsageRecordEntity[]> {
    const where = { organizationId };
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const models = await this.prisma.usageRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    return models.map(UsageMapper.toDomain);
  }

  async findByApiKeyId(apiKeyId: string, options?: { limit?: number; offset?: number }): Promise<UsageRecordEntity[]> {
    const where = { apiKeyId };
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const models = await this.prisma.usageRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    return models.map(UsageMapper.toDomain);
  }

  async create(record: UsageRecordEntity): Promise<UsageRecordEntity> {
    const model = await this.prisma.usageRecord.create({
      data: {
        id: record.id,
        organizationId: record.organizationId,
        apiKeyId: record.apiKeyId,
        requestId: record.requestId,
        endpoint: record.endpoint,
        method: record.method,
        cost: record.cost,
        status: record.status,
        remaining: record.remaining ? Number(record.remaining) : undefined,
        reason: record.reason,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
        createdAt: record.createdAt,
      },
    });
    return UsageMapper.toDomain(model);
  }

  async countByOrganization(organizationId: string): Promise<number> {
    const count = await this.prisma.usageRecord.count({ where: { organizationId } });
    return count;
  }

  async countByApiKey(apiKeyId: string): Promise<number> {
    const count = await this.prisma.usageRecord.count({ where: { apiKeyId } });
    return count;
  }
}
