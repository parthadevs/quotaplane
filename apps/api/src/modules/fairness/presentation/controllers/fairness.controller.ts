import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../organizations/presentation/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../organizations/presentation/guards/organization.guard';
import { CalculateFairnessUseCase } from '../../application/use-cases/calculate-fairness.use-case';

@Controller('organizations/:organizationId/fairness')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class FairnessController {
  constructor(private readonly calculateFairnessUseCase: CalculateFairnessUseCase) {}

  @Get()
  async getFairnessAllocation(@Param('organizationId') organizationId: string) {
    return this.calculateFairnessUseCase.execute(organizationId);
  }
}
