import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { ApiKeyResponseDto } from '../dto/api-key-response.dto';
import { ApiKeyStatus } from '../../domain/types/api-key.types';
import * as crypto from 'crypto';

@Injectable()
export class RotateApiKeyUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(organizationId: string, apiKeyId: string): Promise<ApiKeyResponseDto> {
    const key = await this.apiKeyRepository.findById(apiKeyId);
    if (!key || key.organizationId !== organizationId) {
      throw new NotFoundException('API key not found');
    }

    const prefix = 'qpl_live';
    const randomBytes = crypto.randomBytes(24).toString('hex');
    const rawKey = `${prefix}_${randomBytes}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 12);

    const updated = ApiKeyEntity.create({
      ...key.toObject(),
      keyHash,
      keyPrefix,
      status: ApiKeyStatus.ACTIVE,
      revokedAt: undefined,
      updatedAt: new Date(),
    });

    const saved = await this.apiKeyRepository.update(updated);
    return ApiKeyResponseDto.fromEntity(saved, rawKey);
  }
}
