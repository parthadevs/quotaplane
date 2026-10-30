import { Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';

@Injectable()
export class ListApiKeysUseCase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async execute(organizationId: string): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.findByOrganizationId(organizationId);
  }
}
