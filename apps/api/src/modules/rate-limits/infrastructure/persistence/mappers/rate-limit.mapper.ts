import { RateLimitRule as PrismaRateLimitRule } from '@prisma/client';
import { RateLimitRuleEntity } from '../../../domain/entities/rate-limit-rule.entity';

export class RateLimitMapper {
  static toDomain(model: PrismaRateLimitRule): RateLimitRuleEntity {
    return RateLimitRuleEntity.fromPrisma(model);
  }
}
