import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationMemberEntity } from '../../domain/entities/organization-member.entity';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';

@Injectable()
export class ListMembersUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: OrganizationMemberRepository,
  ) {}

  async execute(organizationId: string): Promise<OrganizationMemberEntity[]> {
    if (!(await this.organizationRepository.findById(organizationId))) {
      throw new NotFoundException('Organization not found');
    }
    return this.memberRepository.findAllByOrganization(organizationId);
  }
}
