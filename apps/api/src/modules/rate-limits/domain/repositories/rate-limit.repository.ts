import { RateLimitRuleEntity } from '../entities/rate-limit-rule.entity';

export abstract class RateLimitRepository {
  abstract findById(id: string): Promise<RateLimitRuleEntity | null>;

  abstract findByOrganizationId(organizationId: string): Promise<RateLimitRuleEntity[]>;

  abstract create(rule: RateLimitRuleEntity): Promise<RateLimitRuleEntity>;

  abstract update(rule: RateLimitRuleEntity): Promise<RateLimitRuleEntity>;

  abstract delete(id: string): Promise<void>;

  abstract existsByName(organizationId: string, name: string): Promise<boolean>;
}
