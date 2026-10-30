import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { QuotaRepository } from '../../domain/repositories/quota.repository';
import { QuotaEntity } from '../../domain/entities/quota.entity';
import { QuotaCheckResponseDto } from '../dto/quota-check-response.dto';

@Injectable()
export class CheckQuotaUseCase {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  async execute(organizationId: string, cost: number = 1): Promise<QuotaCheckResponseDto> {
    if (cost <= 0) {
      throw new BadRequestException('Cost must be greater than 0');
    }

    const quota = await this.quotaRepository.findByOrganizationId(organizationId);
    if (!quota) {
      throw new NotFoundException('Quota not configured for this organization');
    }

    // Check if period has expired and reset if needed
    if (quota.isPeriodExpired()) {
      const { periodStart, periodEnd } = QuotaEntity.calculatePeriodDates(quota.period);
      await this.quotaRepository.resetUsed(organizationId, periodStart, periodEnd);
      // Re-fetch the quota after reset
      const freshQuota = await this.quotaRepository.findByOrganizationId(organizationId);
      if (!freshQuota) {
        throw new NotFoundException('Quota not found after reset');
      }
      return this.checkAllowed(freshQuota, cost);
    }

    return this.checkAllowed(quota, cost);
  }

  private checkAllowed(quota: QuotaEntity, cost: number): QuotaCheckResponseDto {
    const remainingNum = Number(quota.remaining());
    const limitNum = Number(quota.limit);
    const usedNum = Number(quota.used);

    if (quota.canConsume(cost)) {
      return QuotaCheckResponseDto.allowed(cost, remainingNum, limitNum, usedNum);
    } else {
      return QuotaCheckResponseDto.rejected(
        'QUOTA_EXCEEDED',
        cost,
        remainingNum,
        limitNum,
        usedNum,
      );
    }
  }
}
