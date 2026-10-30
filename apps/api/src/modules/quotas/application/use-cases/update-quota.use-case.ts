import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotaRepository } from '../../domain/repositories/quota.repository';
import { QuotaEntity } from '../../domain/entities/quota.entity';
import { UpdateQuotaDto } from '../dto/update-quota.dto';

@Injectable()
export class UpdateQuotaUseCase {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  async execute(organizationId: string, dto: UpdateQuotaDto): Promise<QuotaEntity> {
    const quota = await this.quotaRepository.findByOrganizationId(organizationId);
    if (!quota) {
      throw new NotFoundException('Quota not configured for this organization');
    }

    const period = dto.period ?? quota.period;
    const { periodStart, periodEnd } = QuotaEntity.calculatePeriodDates(period);

    const updated = QuotaEntity.fromPrisma({
      id: quota.id,
      organizationId: quota.organizationId,
      limit: dto.limit !== undefined ? BigInt(dto.limit) : quota.limit,
      period,
      defaultCost: dto.defaultCost ?? quota.defaultCost,
      periodStart,
      periodEnd,
      used: quota.used,
      createdAt: quota.createdAt,
      updatedAt: new Date(),
    });

    return this.quotaRepository.update(updated);
  }
}
