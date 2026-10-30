import { Injectable } from '@nestjs/common';
import { KeyWeightInfo, FairnessAllocationResult } from '../types/fairness.types';

@Injectable()
export class FairnessDomainService {
  calculateAllocation(
    organizationId: string,
    totalQuota: number,
    usedQuota: number,
    keys: KeyWeightInfo[],
  ): FairnessAllocationResult {
    const remainingQuota = Math.max(0, totalQuota - usedQuota);
    const totalWeight = keys.reduce((sum, k) => sum + Math.max(1, k.weight), 0);

    const allocatedKeys = keys.map((key) => {
      const weight = Math.max(1, key.weight);
      const sharePercentage = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
      const allocatedQuota = totalWeight > 0 ? Math.round((weight / totalWeight) * totalQuota) : 0;

      return {
        keyId: key.keyId,
        name: key.name,
        weight,
        sharePercentage: Number(sharePercentage.toFixed(2)),
        allocatedQuota,
      };
    });

    return {
      organizationId,
      totalQuota,
      usedQuota,
      remainingQuota,
      keys: allocatedKeys,
    };
  }
}
