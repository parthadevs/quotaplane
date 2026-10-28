import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationRole } from '../../domain/types/organization.types';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: OrganizationMemberRepository,
  ) {}

  async execute(organizationId: string, actorId: string): Promise<void> {
    if (!(await this.organizationRepository.findById(organizationId))) {
      throw new NotFoundException('Organization not found');
    }
    const actor = await this.memberRepository.findByOrganizationAndUser(organizationId, actorId);
    if (!actor || actor.role !== OrganizationRole.OWNER) {
      throw new ForbiddenException('Only the organization owner can delete it');
    }
    await this.organizationRepository.delete(organizationId);
  }
}
