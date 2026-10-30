import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';

@Injectable()
export class GetApiKeyUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(organizationId: string, apiKeyId: string): Promise<ApiKeyEntity> {
    const key = await this.apiKeyRepository.findById(apiKeyId);
    if (!key || key.organizationId !== organizationId) {
      throw new NotFoundException('API key not found');
    }
    return key;
  }
}
