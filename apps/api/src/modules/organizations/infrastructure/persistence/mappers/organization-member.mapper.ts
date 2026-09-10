import { OrganizationMember } from '@prisma/client';
import { OrganizationMemberEntity } from '../../../domain/entities/organization-member.entity';
import { OrganizationRole } from '../../../domain/types/organization.types';

export class OrganizationMemberMapper {
  static toDomain(model: OrganizationMember): OrganizationMemberEntity {
    return OrganizationMemberEntity.create({
      id: model.id,
      organizationId: model.organizationId,
      userId: model.userId,
      role: model.role as OrganizationRole,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
