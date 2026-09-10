import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationMemberEntity } from '../../domain/entities/organization-member.entity';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationRole } from '../../domain/types/organization.types';

@Injectable()
export class AddMemberUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: OrganizationMemberRepository,
  ) {}

  async execute(organizationId: string, actorId: string, userId: string, role = OrganizationRole.MEMBER): Promise<OrganizationMemberEntity> {
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) throw new NotFoundException('Organization not found');
    if (!organization.isActive()) throw new ForbiddenException('Organization is not active');

    const actor = await this.memberRepository.findByOrganizationAndUser(organizationId, actorId);
    if (!actor || ![OrganizationRole.OWNER, OrganizationRole.ADMIN].includes(actor.role)) {
      throw new ForbiddenException('You do not have permission to add members');
    }
    if (role === OrganizationRole.OWNER || (role === OrganizationRole.ADMIN && actor.role !== OrganizationRole.OWNER)) {
      throw new ForbiddenException('You do not have permission to assign this role');
    }
    if (await this.memberRepository.findByOrganizationAndUser(organizationId, userId)) {
      throw new ConflictException('User is already an organization member');
    }

    const now = new Date();
    return this.memberRepository.create(OrganizationMemberEntity.create({
      id: crypto.randomUUID(), organizationId, userId, role, createdAt: now, updatedAt: now,
    }));
  }
}
