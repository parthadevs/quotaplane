export enum QuotaPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  UNLIMITED = 'UNLIMITED',
}

export interface QuotaProps {
  id: string;
  organizationId: string;
  limit: bigint;
  period: QuotaPeriod;
  defaultCost: number;
  periodStart: Date;
  periodEnd: Date;
  used: bigint;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuotaInput {
  organizationId: string;
  limit: bigint | number;
  period?: QuotaPeriod;
  defaultCost?: number;
  periodStart?: Date;
  periodEnd?: Date;
}

export interface UpdateQuotaInput {
  limit?: bigint | number;
  period?: QuotaPeriod;
  defaultCost?: number;
}

export interface QuotaCheckResult {
  allowed: boolean;
  cost: number;
  remaining: bigint;
  limit: bigint;
  used: bigint;
  reason?: string;
}
