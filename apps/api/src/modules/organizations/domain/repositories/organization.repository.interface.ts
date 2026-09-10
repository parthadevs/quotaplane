import { OrganizationEntity } from '../entities/organization.entity';

export abstract class OrganizationRepository {
  abstract findById(id: string): Promise<OrganizationEntity | null>;

  abstract findBySlug(slug: string): Promise<OrganizationEntity | null>;

  abstract create(
    organization: OrganizationEntity,
  ): Promise<OrganizationEntity>;

  abstract update(
    organization: OrganizationEntity,
  ): Promise<OrganizationEntity>;

  abstract delete(id: string): Promise<void>;
}