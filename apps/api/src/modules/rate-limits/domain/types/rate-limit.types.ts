export enum RateLimitAlgorithm {
  FIXED_WINDOW = 'FIXED_WINDOW',
  SLIDING_WINDOW = 'SLIDING_WINDOW',
  TOKEN_BUCKET = 'TOKEN_BUCKET',
}

export interface RateLimitRuleProps {
  id: string;
  organizationId: string;
  name: string;
  limit: number;
  windowSeconds: number;
  algorithm: RateLimitAlgorithm;
  endpoint?: string;
  method?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
