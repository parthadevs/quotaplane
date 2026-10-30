import { Injectable } from '@nestjs/common';
import { RateLimitRepository } from '../../domain/repositories/rate-limit.repository';
import { RateLimitRuleEntity } from '../../domain/entities/rate-limit-rule.entity';

@Injectable()
export class ListRateLimitRulesUseCase {
  constructor(private readonly rateLimitRepository: RateLimitRepository) {}

  async execute(organizationId: string): Promise<RateLimitRuleEntity[]> {
    return this.rateLimitRepository.findByOrganizationId(organizationId);
  }
}
