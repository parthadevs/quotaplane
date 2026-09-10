import { OrganizationMemberEntity } from "../entities/organization-member.entity";

export abstract class OrganizationMemberRepository {
  abstract findById(
    id: string,
  ): Promise<OrganizationMemberEntity | null>;

  abstract findByOrganizationAndUser(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationMemberEntity | null>;

  abstract findAllByOrganization(
    organizationId: string,
  ): Promise<OrganizationMemberEntity[]>;

  abstract create(
    member: OrganizationMemberEntity,
  ): Promise<OrganizationMemberEntity>;

  abstract update(
    member: OrganizationMemberEntity,
  ): Promise<OrganizationMemberEntity>;

  abstract delete(id: string): Promise<void>;
}