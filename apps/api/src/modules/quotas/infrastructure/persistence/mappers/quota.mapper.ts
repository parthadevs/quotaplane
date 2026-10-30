import { Quota as PrismaQuota } from '@prisma/client';
import { QuotaEntity } from '../../../domain/entities/quota.entity';

export class QuotaMapper {
  static toDomain(model: PrismaQuota): QuotaEntity {
    return QuotaEntity.fromPrisma(model);
  }
}
