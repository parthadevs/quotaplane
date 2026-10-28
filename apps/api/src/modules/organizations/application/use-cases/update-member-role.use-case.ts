import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { OrganizationMemberEntity } from '../../domain/entities/organization-member.entity';
import { OrganizationMemberRepository } from '../../domain/repositories/organization-member.repository';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationRole } from '../../domain/types/organization.types';

@Injectable()
export class UpdateMemberRoleUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly memberRepository: OrganizationMemberRepository,
  ) {}

  async execute(organizationId: string, actorId: string, userId: string, dto: UpdateMemberRoleDto): Promise<OrganizationMemberEntity> {
    if (!(await this.organizationRepository.findById(organizationId))) {
      throw new NotFoundException('Organization not found');
    }
    const [actor, member] = await Promise.all([
      this.memberRepository.findByOrganizationAndUser(organizationId, actorId),
      this.memberRepository.findByOrganizationAndUser(organizationId, userId),
    ]);
    if (!member) throw new NotFoundException('Organization member not found');
    if (!actor || actor.role !== OrganizationRole.OWNER) {
      throw new ForbiddenException('Only the organization owner can change member roles');
    }
    if (member.role === OrganizationRole.OWNER || dto.role === OrganizationRole.OWNER) {
      throw new ForbiddenException('Ownership cannot be changed through this operation');
    }

    return this.memberRepository.update(OrganizationMemberEntity.create({
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      role: dto.role,
      createdAt: member.createdAt,
      updatedAt: new Date(),
    }));
  }
}
