import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotaRepository } from '../../domain/repositories/quota.repository';
import { QuotaEntity } from '../../domain/entities/quota.entity';
import { CreateQuotaInput } from '../../domain/types/quota.types';

@Injectable()
export class GetQuotaUseCase {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  async execute(organizationId: string): Promise<QuotaEntity> {
    const quota = await this.quotaRepository.findByOrganizationId(organizationId);
    if (!quota) {
      throw new NotFoundException('Quota not configured for this organization');
    }

    // Check if period has expired and reset if needed
    if (quota.isPeriodExpired()) {
      const { periodStart, periodEnd } = QuotaEntity.calculatePeriodDates(quota.period);
      return this.quotaRepository.resetUsed(organizationId, periodStart, periodEnd);
    }

    return quota;
  }
}
