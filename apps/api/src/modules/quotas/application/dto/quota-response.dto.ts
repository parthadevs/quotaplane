import { QuotaEntity } from '../../domain/entities/quota.entity';
import { QuotaPeriod } from '../../domain/types/quota.types';

export class QuotaResponseDto {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly limit: number,
    public readonly period: QuotaPeriod,
    public readonly defaultCost: number,
    public readonly periodStart: Date,
    public readonly periodEnd: Date,
    public readonly used: number,
    public readonly remaining: number,
    public readonly isExceeded: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromEntity(entity: QuotaEntity): QuotaResponseDto {
    const limitNum = Number(entity.limit);
    const usedNum = Number(entity.used);
    const remainingNum = Number(entity.remaining());

    return new QuotaResponseDto(
      entity.id,
      entity.organizationId,
      limitNum,
      entity.period,
      entity.defaultCost,
      entity.periodStart,
      entity.periodEnd,
      usedNum,
      remainingNum,
      usedNum >= limitNum && entity.period !== QuotaPeriod.UNLIMITED,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
