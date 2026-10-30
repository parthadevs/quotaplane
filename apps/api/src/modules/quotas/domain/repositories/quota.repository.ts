import { QuotaEntity } from '../entities/quota.entity';

export abstract class QuotaRepository {
  abstract findById(id: string): Promise<QuotaEntity | null>;

  abstract findByOrganizationId(organizationId: string): Promise<QuotaEntity | null>;

  abstract create(quota: QuotaEntity): Promise<QuotaEntity>;

  abstract update(quota: QuotaEntity): Promise<QuotaEntity>;

  abstract delete(id: string): Promise<void>;

  abstract incrementUsed(organizationId: string, cost: number): Promise<QuotaEntity>;

  abstract resetUsed(organizationId: string, periodStart: Date, periodEnd: Date): Promise<QuotaEntity>;
}
