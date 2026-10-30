import { Injectable } from '@nestjs/common';
import { UsageRepository } from '../../domain/repositories/usage.repository';
import { UsageRecordEntity } from '../../domain/entities/usage-record.entity';

@Injectable()
export class ListUsageUseCase {
  constructor(private readonly usageRepository: UsageRepository) {}

  async execute(organizationId: string, limit?: number, offset?: number): Promise<UsageRecordEntity[]> {
    return this.usageRepository.findByOrganizationId(organizationId, { limit, offset });
  }
}
