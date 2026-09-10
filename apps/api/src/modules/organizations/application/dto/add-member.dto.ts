import { OrganizationRole } from '../../domain/types/organization.types';

export interface AddMemberDto {
  userId: string;
  role?: OrganizationRole;
}
