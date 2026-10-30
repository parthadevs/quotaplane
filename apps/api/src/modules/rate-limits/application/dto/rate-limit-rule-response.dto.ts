import { RateLimitRuleEntity } from '../../domain/entities/rate-limit-rule.entity';
import { RateLimitAlgorithm } from '../../domain/types/rate-limit.types';

export class RateLimitRuleResponseDto {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly limit: number,
    public readonly windowSeconds: number,
    public readonly algorithm: RateLimitAlgorithm,
    public readonly endpoint: string | undefined,
    public readonly method: string | undefined,
    public readonly enabled: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromEntity(entity: RateLimitRuleEntity): RateLimitRuleResponseDto {
    return new RateLimitRuleResponseDto(
      entity.id,
      entity.organizationId,
      entity.name,
      entity.limit,
      entity.windowSeconds,
      entity.algorithm,
      entity.endpoint,
      entity.method,
      entity.enabled,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
