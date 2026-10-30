import { Injectable, NotFoundException } from '@nestjs/common';
import { RateLimitRepository } from '../../domain/repositories/rate-limit.repository';
import { RateLimitRuleEntity } from '../../domain/entities/rate-limit-rule.entity';

@Injectable()
export class GetRateLimitRuleUseCase {
  constructor(private readonly rateLimitRepository: RateLimitRepository) {}

  async execute(organizationId: string, ruleId: string): Promise<RateLimitRuleEntity> {
    const rule = await this.rateLimitRepository.findById(ruleId);
    if (!rule || rule.organizationId !== organizationId) {
      throw new NotFoundException('Rate limit rule not found');
    }
    return rule;
  }
}
