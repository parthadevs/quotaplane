import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationEntity, OrganizationStatus } from '../../domain/entities/organization.entity';
import { OrganizationMemberEntity } from '../../domain/entities/organization-member.entity';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationRole } from '../../domain/types/organization.types';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: OrganizationMemberRepository,
  ) {}

  async execute(dto: CreateOrganizationDto, ownerId: string): Promise<OrganizationEntity> {
    const slug = dto.slug.trim().toLowerCase();
    const existingOrganization = await this.organizationRepository.findBySlug(slug);
    if (existingOrganization) {
      throw new ConflictException('Organization slug already exists');
    }

    const now = new Date();
    const organization = await this.organizationRepository.create(OrganizationEntity.create({
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      slug,
      status: OrganizationStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    }));

    await this.memberRepository.create(OrganizationMemberEntity.create({
      id: crypto.randomUUID(),
      organizationId: organization.id,
      userId: ownerId,
      role: OrganizationRole.OWNER,
      createdAt: now,
      updatedAt: now,
    }));

    return organization;
  }
}
