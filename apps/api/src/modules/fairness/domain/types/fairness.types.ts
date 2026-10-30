export interface KeyWeightInfo {
  keyId: string;
  name: string;
  weight: number;
}

export interface FairnessAllocationResult {
  organizationId: string;
  totalQuota: number;
  usedQuota: number;
  remainingQuota: number;
  keys: {
    keyId: string;
    name: string;
    weight: number;
    sharePercentage: number;
    allocatedQuota: number;
  }[];
}
