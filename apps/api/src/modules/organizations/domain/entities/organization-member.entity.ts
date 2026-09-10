import { OrganizationRole } from '../types/organization.types';

interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  createdAt: Date;
  updatedAt: Date;
}

export class OrganizationMemberEntity {
  private constructor(private readonly props: OrganizationMember) {}

  static create(props: OrganizationMember): OrganizationMemberEntity {
    return new OrganizationMemberEntity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get organizationId() : string{
    return this.props.organizationId
  }

  get userId() : string {
    return this.props.userId
  }

  get role(): OrganizationRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
