import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';

@Injectable()
export class GetOrganizationUseCase {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async execute(organizationId: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }
}
