import { Injectable, ConflictException } from '@nestjs/common';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { ApiKeyResponseDto } from '../dto/api-key-response.dto';
import { ApiKeyStatus } from '../../domain/types/api-key.types';
import * as crypto from 'crypto';

@Injectable()
export class CreateApiKeyUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(organizationId: string, dto: CreateApiKeyDto): Promise<ApiKeyResponseDto> {
    const exists = await this.apiKeyRepository.existsByName(organizationId, dto.name);
    if (exists) {
      throw new ConflictException('API key with this name already exists in organization');
    }

    const prefix = 'qpl_live';
    const randomBytes = crypto.randomBytes(24).toString('hex');
    const rawKey = `${prefix}_${randomBytes}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 12); // e.g. qpl_live_abc1

    const now = new Date();
    const entity = ApiKeyEntity.create({
      id: crypto.randomUUID(),
      organizationId,
      name: dto.name,
      keyHash,
      keyPrefix,
      status: ApiKeyStatus.ACTIVE,
      weight: dto.weight ?? 1,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      lastUsedAt: undefined,
      createdAt: now,
      updatedAt: now,
      revokedAt: undefined,
    });

    const saved = await this.apiKeyRepository.create(entity);
    return ApiKeyResponseDto.fromEntity(saved, rawKey);
  }
}
