import { Organization } from '@prisma/client';
import {
  OrganizationEntity,
  OrganizationStatus,
} from '../../../domain/entities/organization.entity';

export class OrganizationMapper {
  static toDomain(model: Organization): OrganizationEntity {
    return OrganizationEntity.create({
      id: model.id,
      name: model.name,
      slug: model.slug,
      status: model.status as OrganizationStatus,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
