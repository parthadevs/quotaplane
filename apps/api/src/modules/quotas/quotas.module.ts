import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { OrganizationsModule } from '../organizations/organizations.module';
import { QuotaRepository } from './domain/repositories/quota.repository';
import { PrismaQuotaRepository } from './infrastructure/persistence/prisma-quota.repository';
import {
  GetQuotaUseCase,
  SetQuotaUseCase,
  UpdateQuotaUseCase,
  CheckQuotaUseCase,
  ResetQuotaUseCase,
} from './application/use-cases';
import { QuotaController } from './presentation/controllers/quota.controller';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [QuotaController],
  providers: [
    {
      provide: QuotaRepository,
      useClass: PrismaQuotaRepository,
    },
    GetQuotaUseCase,
    SetQuotaUseCase,
    UpdateQuotaUseCase,
    CheckQuotaUseCase,
    ResetQuotaUseCase,
  ],
  exports: [QuotaRepository],
})
export class QuotasModule {}
