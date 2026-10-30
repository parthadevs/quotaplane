import { UsageStatus, UsageRecordProps, CreateUsageRecordInput } from '../types/usage.types';

export class UsageRecordEntity {
  private constructor(private readonly props: UsageRecordProps) {}

  static create(input: CreateUsageRecordInput): UsageRecordEntity {
    return new UsageRecordEntity({
      id: crypto.randomUUID(),
      organizationId: input.organizationId,
      apiKeyId: input.apiKeyId,
      requestId: input.requestId,
      endpoint: input.endpoint,
      method: input.method,
      cost: input.cost ?? 1,
      status: input.status,
      remaining: input.remaining,
      reason: input.reason,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      createdAt: new Date(),
    });
  }

  static fromPrisma(data: any): UsageRecordEntity {
    return new UsageRecordEntity({
      id: data.id,
      organizationId: data.organizationId,
      apiKeyId: data.apiKeyId ?? undefined,
      requestId: data.requestId ?? undefined,
      endpoint: data.endpoint ?? undefined,
      method: data.method ?? undefined,
      cost: data.cost,
      status: data.status as UsageStatus,
      remaining: data.remaining ? BigInt(data.remaining) : undefined,
      reason: data.reason ?? undefined,
      ipAddress: data.ipAddress ?? undefined,
      userAgent: data.userAgent ?? undefined,
      createdAt: data.createdAt,
    });
  }

  get id(): string { return this.props.id; }
  get organizationId(): string { return this.props.organizationId; }
  get apiKeyId(): string | undefined { return this.props.apiKeyId; }
  get requestId(): string | undefined { return this.props.requestId; }
  get endpoint(): string | undefined { return this.props.endpoint; }
  get method(): string | undefined { return this.props.method; }
  get cost(): number { return this.props.cost; }
  get status(): UsageStatus { return this.props.status; }
  get remaining(): bigint | undefined { return this.props.remaining; }
  get reason(): string | undefined { return this.props.reason; }
  get ipAddress(): string | undefined { return this.props.ipAddress; }
  get userAgent(): string | undefined { return this.props.userAgent; }
  get createdAt(): Date { return this.props.createdAt; }

  toObject(): UsageRecordProps {
    return {
      id: this.props.id,
      organizationId: this.props.organizationId,
      apiKeyId: this.props.apiKeyId,
      requestId: this.props.requestId,
      endpoint: this.props.endpoint,
      method: this.props.method,
      cost: this.props.cost,
      status: this.props.status,
      remaining: this.props.remaining,
      reason: this.props.reason,
      ipAddress: this.props.ipAddress,
      userAgent: this.props.userAgent,
      createdAt: this.props.createdAt,
    };
  }
}