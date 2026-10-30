import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsageRepository } from './domain/repositories/usage.repository';
import { PrismaUsageRepository } from './infrastructure/persistence/prisma-usage.repository';
import {
  RecordUsageUseCase,
  ListUsageUseCase,
} from './application/use-cases';
import { UsageController } from './presentation/controllers/usage.controller';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [UsageController],
  providers: [
    {
      provide: UsageRepository,
      useClass: PrismaUsageRepository,
    },
    RecordUsageUseCase,
    ListUsageUseCase,
  ],
  exports: [UsageRepository],
})
export class UsageModule {}
