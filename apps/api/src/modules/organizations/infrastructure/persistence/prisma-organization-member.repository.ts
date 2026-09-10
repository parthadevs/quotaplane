import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { OrganizationMemberEntity } from '../../domain/entities/organization-member.entity';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationMemberMapper } from './mappers/organization-member.mapper';

@Injectable()
export class PrismaOrganizationMemberRepository extends OrganizationMemberRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAllByOrganization(organizationId: string): Promise<OrganizationMemberEntity[]> {
    const models = await this.prisma.organizationMember.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });
    return models.map(OrganizationMemberMapper.toDomain);
  }

  async findById(id: string): Promise<OrganizationMemberEntity | null> {
    const model = await this.prisma.organizationMember.findUnique({ where: { id } });
    return model ? OrganizationMemberMapper.toDomain(model) : null;
  }

  async findByOrganizationAndUser(organizationId: string, userId: string): Promise<OrganizationMemberEntity | null> {
    const model = await this.prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });
    return model ? OrganizationMemberMapper.toDomain(model) : null;
  }

  async create(member: OrganizationMemberEntity): Promise<OrganizationMemberEntity> {
    const model = await this.prisma.organizationMember.create({
      data: {
        id: member.id,
        organizationId: member.organizationId,
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    });
    return OrganizationMemberMapper.toDomain(model);
  }

  async update(member: OrganizationMemberEntity): Promise<OrganizationMemberEntity> {
    const model = await this.prisma.organizationMember.update({
      where: { id: member.id },
      data: { role: member.role, updatedAt: member.updatedAt },
    });
    return OrganizationMemberMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organizationMember.delete({ where: { id } });
  }
}
