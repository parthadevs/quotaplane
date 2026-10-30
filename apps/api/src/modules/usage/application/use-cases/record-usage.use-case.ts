import { Injectable } from '@nestjs/common';
import { UsageRepository } from '../../domain/repositories/usage.repository';
import { UsageRecordEntity } from '../../domain/entities/usage-record.entity';
import { RecordUsageDto } from '../dto/record-usage.dto';

@Injectable()
export class RecordUsageUseCase {
  constructor(private readonly usageRepository: UsageRepository) {}

  async execute(organizationId: string, dto: RecordUsageDto): Promise<UsageRecordEntity> {
    const record = UsageRecordEntity.create({
      organizationId,
      apiKeyId: dto.apiKeyId,
      requestId: dto.requestId,
      endpoint: dto.endpoint,
      method: dto.method,
      cost: dto.cost ?? 1,
      status: dto.status,
      reason: dto.reason,
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
    });

    return this.usageRepository.create(record);
  }
}
