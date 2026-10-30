import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { ApiKeyStatus } from '../../domain/types/api-key.types';

@Injectable()
export class RevokeApiKeyUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(organizationId: string, apiKeyId: string): Promise<void> {
    const key = await this.apiKeyRepository.findById(apiKeyId);
    if (!key || key.organizationId !== organizationId) {
      throw new NotFoundException('API key not found');
    }

    const updated = ApiKeyEntity.create({
      ...key.toObject(),
      status: ApiKeyStatus.REVOKED,
      revokedAt: new Date(),
      updatedAt: new Date(),
    });

    await this.apiKeyRepository.update(updated);
  }
}
