import { Injectable, ConflictException } from '@nestjs/common';
import { RateLimitRepository } from '../../domain/repositories/rate-limit.repository';
import { RateLimitRuleEntity } from '../../domain/entities/rate-limit-rule.entity';
import { CreateRateLimitRuleDto } from '../dto/create-rate-limit-rule.dto';
import { RateLimitAlgorithm } from '../../domain/types/rate-limit.types';

@Injectable()
export class CreateRateLimitRuleUseCase {
  constructor(private readonly rateLimitRepository: RateLimitRepository) {}

  async execute(organizationId: string, dto: CreateRateLimitRuleDto): Promise<RateLimitRuleEntity> {
    const exists = await this.rateLimitRepository.existsByName(organizationId, dto.name);
    if (exists) {
      throw new ConflictException('Rate limit rule with this name already exists in this organization');
    }

    const now = new Date();
    const rule = RateLimitRuleEntity.create({
      id: crypto.randomUUID(),
      organizationId,
      name: dto.name,
      limit: dto.limit,
      windowSeconds: dto.windowSeconds,
      algorithm: dto.algorithm ?? RateLimitAlgorithm.FIXED_WINDOW,
      endpoint: dto.endpoint,
      method: dto.method,
      enabled: dto.enabled ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return this.rateLimitRepository.create(rule);
  }
}
