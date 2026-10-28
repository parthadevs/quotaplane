import type {
  OrganizationEntity,
  OrganizationStatus,
} from '../../domain/entities/organization.entity';

/** Public API representation of an organization. */
export class OrganizationResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly status: OrganizationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromEntity(organization: OrganizationEntity): OrganizationResponseDto {
    return new OrganizationResponseDto(
      organization.id,
      organization.name,
      organization.slug,
      organization.status,
      organization.createdAt,
      organization.updatedAt,
    );
  }
}
