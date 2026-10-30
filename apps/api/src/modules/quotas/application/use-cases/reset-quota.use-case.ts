import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotaRepository } from '../../domain/repositories/quota.repository';
import { QuotaEntity } from '../../domain/entities/quota.entity';

@Injectable()
export class ResetQuotaUseCase {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  async execute(organizationId: string): Promise<QuotaEntity> {
    const quota = await this.quotaRepository.findByOrganizationId(organizationId);
    if (!quota) {
      throw new NotFoundException('Quota not configured for this organization');
    }

    const { periodStart, periodEnd } = QuotaEntity.calculatePeriodDates(quota.period);
    return this.quotaRepository.resetUsed(organizationId, periodStart, periodEnd);
  }
}
