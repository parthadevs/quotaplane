import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RateLimitRepository } from '../../domain/repositories/rate-limit.repository';
import { RateLimitRuleEntity } from '../../domain/entities/rate-limit-rule.entity';
import { RateLimitMapper } from './mappers/rate-limit.mapper';

@Injectable()
export class PrismaRateLimitRepository extends RateLimitRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<RateLimitRuleEntity | null> {
    const model = await this.prisma.rateLimitRule.findUnique({ where: { id } });
    return model ? RateLimitMapper.toDomain(model) : null;
  }

  async findByOrganizationId(organizationId: string): Promise<RateLimitRuleEntity[]> {
    const models = await this.prisma.rateLimitRule.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return models.map(RateLimitMapper.toDomain);
  }

  async create(rule: RateLimitRuleEntity): Promise<RateLimitRuleEntity> {
    const model = await this.prisma.rateLimitRule.create({
      data: {
        id: rule.id,
        organizationId: rule.organizationId,
        name: rule.name,
        limit: rule.limit,
        windowSeconds: rule.windowSeconds,
        algorithm: rule.algorithm,
        endpoint: rule.endpoint,
        method: rule.method,
        enabled: rule.enabled,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      },
    });
    return RateLimitMapper.toDomain(model);
  }

  async update(rule: RateLimitRuleEntity): Promise<RateLimitRuleEntity> {
    const model = await this.prisma.rateLimitRule.update({
      where: { id: rule.id },
      data: {
        name: rule.name,
        limit: rule.limit,
        windowSeconds: rule.windowSeconds,
        algorithm: rule.algorithm,
        endpoint: rule.endpoint,
        method: rule.method,
        enabled: rule.enabled,
        updatedAt: new Date(),
      },
    });
    return RateLimitMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rateLimitRule.delete({ where: { id } });
  }

  async existsByName(organizationId: string, name: string): Promise<boolean> {
    const count = await this.prisma.rateLimitRule.count({
      where: { organizationId, name },
    });
    return count > 0;
  }
}
