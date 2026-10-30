import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import { ApiKeyStatus } from '../../domain/types/api-key.types';

@Injectable()
export class UpdateApiKeyUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(organizationId: string, apiKeyId: string, dto: UpdateApiKeyDto): Promise<ApiKeyEntity> {
    const key = await this.apiKeyRepository.findById(apiKeyId);
    if (!key || key.organizationId !== organizationId) {
      throw new NotFoundException('API key not found');
    }

    const updated = ApiKeyEntity.create({
      id: key.id,
      organizationId: key.organizationId,
      name: dto.name ?? key.name,
      keyHash: key.keyHash,
      keyPrefix: key.keyPrefix,
      status: dto.status ?? key.status,
      weight: dto.weight ?? key.weight,
      expiresAt: dto.expiresAt !== undefined ? (dto.expiresAt ? new Date(dto.expiresAt) : undefined) : key.expiresAt,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
      updatedAt: new Date(),
      revokedAt: dto.status === ApiKeyStatus.REVOKED && key.status !== ApiKeyStatus.REVOKED ? new Date() : key.revokedAt,
    });

    return this.apiKeyRepository.update(updated);
  }
}
