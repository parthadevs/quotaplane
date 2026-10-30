import { ApiKey as PrismaApiKey } from '@prisma/client';
import { ApiKeyEntity } from '../../../domain/entities/api-key.entity';
import { ApiKeyStatus } from '../../../domain/types/api-key.types';

export class ApiKeyMapper {
  static toDomain(model: PrismaApiKey): ApiKeyEntity {
    return ApiKeyEntity.create({
      id: model.id,
      organizationId: model.organizationId,
      name: model.name,
      keyHash: model.keyHash,
      keyPrefix: model.keyPrefix ?? undefined,
      status: model.status as ApiKeyStatus,
      weight: model.weight,
      expiresAt: model.expiresAt ?? undefined,
      lastUsedAt: model.lastUsedAt ?? undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      revokedAt: model.revokedAt ?? undefined,
    });
  }
}
