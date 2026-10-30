import { UsageRecordEntity } from '../../domain/entities/usage-record.entity';
import { UsageStatus } from '../../domain/types/usage.types';

export class UsageRecordResponseDto {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly apiKeyId: string | undefined,
    public readonly requestId: string | undefined,
    public readonly endpoint: string | undefined,
    public readonly method: string | undefined,
    public readonly cost: number,
    public readonly status: UsageStatus,
    public readonly remaining: number | undefined,
    public readonly reason: string | undefined,
    public readonly ipAddress: string | undefined,
    public readonly userAgent: string | undefined,
    public readonly createdAt: Date,
  ) {}

  static fromEntity(entity: UsageRecordEntity): UsageRecordResponseDto {
    return new UsageRecordResponseDto(
      entity.id,
      entity.organizationId,
      entity.apiKeyId,
      entity.requestId,
      entity.endpoint,
      entity.method,
      entity.cost,
      entity.status,
      entity.remaining !== undefined ? Number(entity.remaining) : undefined,
      entity.reason,
      entity.ipAddress,
      entity.userAgent,
      entity.createdAt,
    );
  }
}
