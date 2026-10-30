import { Injectable, NotFoundException } from '@nestjs/common';
import { RateLimitRepository } from '../../domain/repositories/rate-limit.repository';

@Injectable()
export class DeleteRateLimitRuleUseCase {
  constructor(private readonly rateLimitRepository: RateLimitRepository) {}

  async execute(organizationId: string, ruleId: string): Promise<void> {
    const rule = await this.rateLimitRepository.findById(ruleId);
    if (!rule || rule.organizationId !== organizationId) {
      throw new NotFoundException('Rate limit rule not found');
    }
    await this.rateLimitRepository.delete(ruleId);
  }
}
