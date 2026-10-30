import { Injectable, NotFoundException } from '@nestjs/common';
import { FairnessDomainService } from '../../domain/services/fairness.domain.service';
import { FairnessAllocationResult } from '../../domain/types/fairness.types';
import { PrismaService } from '@app/prisma';

@Injectable()
export class CalculateFairnessUseCase {
  constructor(
    private readonly fairnessService: FairnessDomainService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(organizationId: string): Promise<FairnessAllocationResult> {
    const quota = await this.prisma.quota.findUnique({
      where: { organizationId },
    });
    if (!quota) {
      throw new NotFoundException('Quota not configured for this organization');
    }

    const apiKeys = await this.prisma.apiKey.findMany({
      where: { organizationId, status: 'ACTIVE' },
    });

    const keysInfo = apiKeys.map((k) => ({
      keyId: k.id,
      name: k.name,
      weight: k.weight,
    }));

    return this.fairnessService.calculateAllocation(
      organizationId,
      Number(quota.limit),
      Number(quota.used),
      keysInfo,
    );
  }
}
