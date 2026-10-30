import { Injectable, NotFoundException } from '@nestjs/common';
import { RateLimitRepository } from '../../domain/repositories/rate-limit.repository';
import { RateLimitRuleEntity } from '../../domain/entities/rate-limit-rule.entity';
import { UpdateRateLimitRuleDto } from '../dto/update-rate-limit-rule.dto';

@Injectable()
export class UpdateRateLimitRuleUseCase {
  constructor(private readonly rateLimitRepository: RateLimitRepository) {}

  async execute(organizationId: string, ruleId: string, dto: UpdateRateLimitRuleDto): Promise<RateLimitRuleEntity> {
    const rule = await this.rateLimitRepository.findById(ruleId);
    if (!rule || rule.organizationId !== organizationId) {
      throw new NotFoundException('Rate limit rule not found');
    }

    const updated = RateLimitRuleEntity.create({
      id: rule.id,
      organizationId: rule.organizationId,
      name: dto.name ?? rule.name,
      limit: dto.limit ?? rule.limit,
      windowSeconds: dto.windowSeconds ?? rule.windowSeconds,
      algorithm: dto.algorithm ?? rule.algorithm,
      endpoint: dto.endpoint !== undefined ? dto.endpoint : rule.endpoint,
      method: dto.method !== undefined ? dto.method : rule.method,
      enabled: dto.enabled !== undefined ? dto.enabled : rule.enabled,
      createdAt: rule.createdAt,
      updatedAt: new Date(),
    });

    return this.rateLimitRepository.update(updated);
  }
}
