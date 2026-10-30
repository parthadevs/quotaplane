import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';
import { ApiKeyMapper } from './mappers/api-key.mapper';
import { ApiKeyStatus } from '../../domain/types/api-key.types';

@Injectable()
export class PrismaApiKeyRepository extends ApiKeyRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<ApiKeyEntity | null> {
    const model = await this.prisma.apiKey.findUnique({ where: { id } });
    return model ? ApiKeyMapper.toDomain(model) : null;
  }

  async findByOrganizationId(
    organizationId: string,
    options?: { status?: ApiKeyStatus },
  ): Promise<ApiKeyEntity[]> {
    const where: any = { organizationId };
    if (options?.status) where.status = options.status;

    const models = await this.prisma.apiKey.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return models.map(ApiKeyMapper.toDomain);
  }

  async findByKeyHash(keyHash: string): Promise<ApiKeyEntity | null> {
    const model = await this.prisma.apiKey.findUnique({ where: { keyHash } });
    return model ? ApiKeyMapper.toDomain(model) : null;
  }

  async create(apiKey: ApiKeyEntity): Promise<ApiKeyEntity> {
    const model = await this.prisma.apiKey.create({
      data: {
        id: apiKey.id,
        organizationId: apiKey.organizationId,
        name: apiKey.name,
        keyHash: apiKey.keyHash,
        keyPrefix: apiKey.keyPrefix,
        status: apiKey.status,
        weight: apiKey.weight,
        expiresAt: apiKey.expiresAt,
        lastUsedAt: apiKey.lastUsedAt,
        revokedAt: apiKey.revokedAt,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
      },
    });
    return ApiKeyMapper.toDomain(model);
  }

  async update(apiKey: ApiKeyEntity): Promise<ApiKeyEntity> {
    const model = await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: {
        name: apiKey.name,
        status: apiKey.status,
        weight: apiKey.weight,
        expiresAt: apiKey.expiresAt,
        lastUsedAt: apiKey.lastUsedAt,
        revokedAt: apiKey.revokedAt,
        updatedAt: apiKey.updatedAt,
      },
    });
    return ApiKeyMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.apiKey.delete({ where: { id } });
  }

  async existsByName(organizationId: string, name: string): Promise<boolean> {
    const count = await this.prisma.apiKey.count({
      where: { organizationId, name },
    });
    return count > 0;
  }
}
