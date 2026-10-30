import { RateLimitAlgorithm, RateLimitRuleProps } from '../types/rate-limit.types';

export class RateLimitRuleEntity {
  private constructor(private readonly props: RateLimitRuleProps) {}

  static create(input: RateLimitRuleProps): RateLimitRuleEntity {
    return new RateLimitRuleEntity(input);
  }

  static fromPrisma(data: any): RateLimitRuleEntity {
    return new RateLimitRuleEntity({
      id: data.id,
      organizationId: data.organizationId,
      name: data.name,
      limit: data.limit,
      windowSeconds: data.windowSeconds,
      algorithm: data.algorithm as RateLimitAlgorithm,
      endpoint: data.endpoint ?? undefined,
      method: data.method ?? undefined,
      enabled: data.enabled,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get id(): string { return this.props.id; }
  get organizationId(): string { return this.props.organizationId; }
  get name(): string { return this.props.name; }
  get limit(): number { return this.props.limit; }
  get windowSeconds(): number { return this.props.windowSeconds; }
  get algorithm(): RateLimitAlgorithm { return this.props.algorithm; }
  get endpoint(): string | undefined { return this.props.endpoint; }
  get method(): string | undefined { return this.props.method; }
  get enabled(): boolean { return this.props.enabled; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toObject(): RateLimitRuleProps {
    return {
      id: this.props.id,
      organizationId: this.props.organizationId,
      name: this.props.name,
      limit: this.props.limit,
      windowSeconds: this.props.windowSeconds,
      algorithm: this.props.algorithm,
      endpoint: this.props.endpoint,
      method: this.props.method,
      enabled: this.props.enabled,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
