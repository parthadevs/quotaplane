import { UsageRecord as PrismaUsageRecord } from '@prisma/client';
import { UsageRecordEntity } from '../../../domain/entities/usage-record.entity';

export class UsageMapper {
  static toDomain(model: PrismaUsageRecord): UsageRecordEntity {
    return UsageRecordEntity.fromPrisma(model);
  }
}