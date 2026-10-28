import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationRole } from '../../domain/types/organization.types';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: OrganizationMemberRepository,
  ) {}

  async execute(organizationId: string, actorId: string, dto: UpdateOrganizationDto): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) throw new NotFoundException('Organization not found');
    if (!organization.isActive()) throw new ForbiddenException('Organization is not active');

    const actor = await this.memberRepository.findByOrganizationAndUser(organizationId, actorId);
    if (!actor || ![OrganizationRole.OWNER, OrganizationRole.ADMIN].includes(actor.role)) {
      throw new ForbiddenException('You do not have permission to update this organization');
    }

    const slug = dto.slug === undefined ? organization.slug : dto.slug.trim().toLowerCase();
    if (slug !== organization.slug) {
      const existing = await this.organizationRepository.findBySlug(slug);
      if (existing && existing.id !== organizationId) throw new ConflictException('Organization slug already exists');
    }

    return this.organizationRepository.update(OrganizationEntity.create({
      id: organization.id,
      name: dto.name === undefined ? organization.name : dto.name.trim(),
      slug,
      status: organization.status,
      createdAt: organization.createdAt,
      updatedAt: new Date(),
    }));
  }
}
