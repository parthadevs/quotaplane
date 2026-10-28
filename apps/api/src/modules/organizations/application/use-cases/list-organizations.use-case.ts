import { Injectable } from '@nestjs/common';
import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';

@Injectable()
export class ListOrganizationsUseCase {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  execute(): Promise<OrganizationEntity[]> {
    return this.organizationRepository.findAll();
  }
}
