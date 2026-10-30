import { UsageRecordEntity } from '../entities/usage-record.entity';

export abstract class UsageRepository {
  abstract findById(id: string): Promise<UsageRecordEntity | null>;

  abstract findByOrganizationId(organizationId: string, options?: { limit?: number; offset?: number }): Promise<UsageRecordEntity[]>;

  abstract findByApiKeyId(apiKeyId: string, options?: { limit?: number; offset?: number }): Promise<UsageRecordEntity[]>;

  abstract create(record: UsageRecordEntity): Promise<UsageRecordEntity>;

  abstract countByOrganization(organizationId: string): Promise<number>;

  abstract countByApiKey(apiKeyId: string): Promise<number>;
}