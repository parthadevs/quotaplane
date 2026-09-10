import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationMapper } from './mappers/organization.mapper';

@Injectable()
export class PrismaOrganizationRepository extends OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(organization: OrganizationEntity): Promise<OrganizationEntity> {
    const model = await this.prisma.organization.create({
      data: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        status: organization.status,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      },
    });
    return OrganizationMapper.toDomain(model);
  }

  async findAll(): Promise<OrganizationEntity[]> {
    const models = await this.prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return models.map(OrganizationMapper.toDomain);
  }

  async findById(id: string): Promise<OrganizationEntity | null> {
    const model = await this.prisma.organization.findUnique({ where: { id } });
    return model ? OrganizationMapper.toDomain(model) : null;
  }

  async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    const model = await this.prisma.organization.findUnique({ where: { slug } });
    return model ? OrganizationMapper.toDomain(model) : null;
  }

  async update(organization: OrganizationEntity): Promise<OrganizationEntity> {
    const model = await this.prisma.organization.update({
      where: { id: organization.id },
      data: {
        name: organization.name,
        slug: organization.slug,
        status: organization.status,
        updatedAt: organization.updatedAt,
      },
    });
    return OrganizationMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({ where: { id } });
  }
}
