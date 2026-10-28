import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationRole } from '../../domain/types/organization.types';

@Injectable()
export class RemoveMemberUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: OrganizationMemberRepository,
  ) {}

  async execute(organizationId: string, actorId: string, userId: string): Promise<void> {
    if (!(await this.organizationRepository.findById(organizationId))) {
      throw new NotFoundException('Organization not found');
    }
    const [actor, member] = await Promise.all([
      this.memberRepository.findByOrganizationAndUser(organizationId, actorId),
      this.memberRepository.findByOrganizationAndUser(organizationId, userId),
    ]);
    if (!member) throw new NotFoundException('Organization member not found');
    if (actorId === userId) {
      if (member.role === OrganizationRole.OWNER) throw new ForbiddenException('The organization owner cannot leave');
    } else if (!actor || ![OrganizationRole.OWNER, OrganizationRole.ADMIN].includes(actor.role)) {
      throw new ForbiddenException('You do not have permission to remove members');
    } else if (member.role === OrganizationRole.OWNER || (member.role === OrganizationRole.ADMIN && actor.role !== OrganizationRole.OWNER)) {
      throw new ForbiddenException('You do not have permission to remove this member');
    }
    await this.memberRepository.delete(member.id);
  }
}
