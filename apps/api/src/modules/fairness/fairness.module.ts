import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { OrganizationsModule } from '../organizations/organizations.module';
import { FairnessDomainService } from './domain/services/fairness.domain.service';
import { CalculateFairnessUseCase } from './application/use-cases/calculate-fairness.use-case';
import { FairnessController } from './presentation/controllers/fairness.controller';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [FairnessController],
  providers: [FairnessDomainService, CalculateFairnessUseCase],
  exports: [FairnessDomainService],
})
export class FairnessModule {}
