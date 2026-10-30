import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { ApiKeyStatus } from '../../domain/types/api-key.types';

export class ApiKeyResponseDto {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly keyPrefix: string | undefined,
    public readonly status: ApiKeyStatus,
    public readonly weight: number,
    public readonly expiresAt: Date | undefined,
    public readonly lastUsedAt: Date | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly revokedAt: Date | undefined,
    public readonly rawKey?: string, // Only returned on creation
  ) {}

  static fromEntity(entity: ApiKeyEntity, rawKey?: string): ApiKeyResponseDto {
    return new ApiKeyResponseDto(
      entity.id,
      entity.organizationId,
      entity.name,
      entity.keyPrefix,
      entity.status,
      entity.weight,
      entity.expiresAt,
      entity.lastUsedAt,
      entity.createdAt,
      entity.updatedAt,
      entity.revokedAt,
      rawKey,
    );
  }
}
