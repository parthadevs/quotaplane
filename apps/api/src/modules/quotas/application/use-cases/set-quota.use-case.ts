import { Injectable } from '@nestjs/common';
import { QuotaRepository } from '../../domain/repositories/quota.repository';
import { QuotaEntity } from '../../domain/entities/quota.entity';
import { SetQuotaDto } from '../dto/set-quota.dto';

@Injectable()
export class SetQuotaUseCase {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  async execute(organizationId: string, dto: SetQuotaDto): Promise<QuotaEntity> {
    const existingQuota = await this.quotaRepository.findByOrganizationId(organizationId);

    if (existingQuota) {
      // Update existing quota
      const { periodStart, periodEnd } = QuotaEntity.calculatePeriodDates(
        dto.period ?? existingQuota.period,
      );

      const updated = QuotaEntity.create({
        organizationId,
        limit: dto.limit,
        period: dto.period ?? existingQuota.period,
        defaultCost: dto.defaultCost ?? existingQuota.defaultCost,
        periodStart,
        periodEnd,
      });

      // Preserve the ID and used amount
      const quotaWithId = QuotaEntity.fromPrisma({
        id: existingQuota.id,
        organizationId: updated.organizationId,
        limit: updated.limit,
        period: updated.period,
        defaultCost: updated.defaultCost,
        periodStart: updated.periodStart,
        periodEnd: updated.periodEnd,
        used: existingQuota.used, // Keep current usage
        createdAt: existingQuota.createdAt,
        updatedAt: new Date(),
      });

      return this.quotaRepository.update(quotaWithId);
    } else {
      // Create new quota
      const newQuota = QuotaEntity.create({
        organizationId,
        limit: dto.limit,
        period: dto.period,
        defaultCost: dto.defaultCost,
      });

      return this.quotaRepository.create(newQuota);
    }
  }
}
