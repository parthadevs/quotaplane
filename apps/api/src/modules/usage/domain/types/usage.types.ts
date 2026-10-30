export enum UsageStatus {
  ALLOWED = 'ALLOWED',
  REJECTED = 'REJECTED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  RATE_LIMITED = 'RATE_LIMITED',
}

export interface UsageRecordProps {
  id: string;
  organizationId: string;
  apiKeyId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  cost: number;
  status: UsageStatus;
  remaining?: bigint;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface CreateUsageRecordInput {
  organizationId: string;
  apiKeyId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  cost?: number;
  status: UsageStatus;
  remaining?: bigint;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UsageStats {
  total: number;
  allowed: number;
  rejected: number;
  quotaExceeded: number;
  rateLimited: number;
}
