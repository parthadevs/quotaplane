import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { QuotaRepository } from '../../domain/repositories/quota.repository';
import { QuotaEntity } from '../../domain/entities/quota.entity';
import { QuotaMapper } from './mappers/quota.mapper';

@Injectable()
export class PrismaQuotaRepository extends QuotaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<QuotaEntity | null> {
    const model = await this.prisma.quota.findUnique({ where: { id } });
    return model ? QuotaMapper.toDomain(model) : null;
  }

  async findByOrganizationId(organizationId: string): Promise<QuotaEntity | null> {
    const model = await this.prisma.quota.findUnique({ where: { organizationId } });
    return model ? QuotaMapper.toDomain(model) : null;
  }

  async create(quota: QuotaEntity): Promise<QuotaEntity> {
    const model = await this.prisma.quota.create({
      data: {
        id: quota.id,
        organizationId: quota.organizationId,
        limit: quota.limit,
        period: quota.period,
        defaultCost: quota.defaultCost,
        periodStart: quota.periodStart,
        periodEnd: quota.periodEnd,
        used: quota.used,
        createdAt: quota.createdAt,
        updatedAt: quota.updatedAt,
      },
    });
    return QuotaMapper.toDomain(model);
  }

  async update(quota: QuotaEntity): Promise<QuotaEntity> {
    const model = await this.prisma.quota.update({
      where: { id: quota.id },
      data: {
        limit: quota.limit,
        period: quota.period,
        defaultCost: quota.defaultCost,
        periodStart: quota.periodStart,
        periodEnd: quota.periodEnd,
        used: quota.used,
        updatedAt: new Date(),
      },
    });
    return QuotaMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.quota.delete({ where: { id } });
  }

  async incrementUsed(organizationId: string, cost: number): Promise<QuotaEntity> {
    const model = await this.prisma.quota.update({
      where: { organizationId },
      data: {
        used: {
          increment: cost,
        },
        updatedAt: new Date(),
      },
    });
    return QuotaMapper.toDomain(model);
  }

  async resetUsed(organizationId: string, periodStart: Date, periodEnd: Date): Promise<QuotaEntity> {
    const model = await this.prisma.quota.update({
      where: { organizationId },
      data: {
        used: BigInt(0),
        periodStart,
        periodEnd,
        updatedAt: new Date(),
      },
    });
    return QuotaMapper.toDomain(model);
  }
}
