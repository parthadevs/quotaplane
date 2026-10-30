import { ApiKeyEntity } from '../entities/api-key.entity';
import { ApiKeyStatus } from '../types/api-key.types';

export abstract class ApiKeyRepository {
  abstract findById(id: string): Promise<ApiKeyEntity | null>;

  abstract findByOrganizationId(
    organizationId: string,
    options?: { status?: ApiKeyStatus },
  ): Promise<ApiKeyEntity[]>;

  abstract findByKeyHash(keyHash: string): Promise<ApiKeyEntity | null>;

  abstract create(apiKey: ApiKeyEntity): Promise<ApiKeyEntity>;

  abstract update(apiKey: ApiKeyEntity): Promise<ApiKeyEntity>;

  abstract delete(id: string): Promise<void>;

  abstract existsByName(organizationId: string, name: string): Promise<boolean>;
}
