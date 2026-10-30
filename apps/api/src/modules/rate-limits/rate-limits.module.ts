import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { OrganizationsModule } from '../organizations/organizations.module';
import { RateLimitRepository } from './domain/repositories/rate-limit.repository';
import { PrismaRateLimitRepository } from './infrastructure/persistence/prisma-rate-limit.repository';
import {
  CreateRateLimitRuleUseCase,
  ListRateLimitRulesUseCase,
  GetRateLimitRuleUseCase,
  UpdateRateLimitRuleUseCase,
  DeleteRateLimitRuleUseCase,
} from './application/use-cases';
import { RateLimitsController } from './presentation/controllers/rate-limits.controller';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [RateLimitsController],
  providers: [
    {
      provide: RateLimitRepository,
      useClass: PrismaRateLimitRepository,
    },
    CreateRateLimitRuleUseCase,
    ListRateLimitRulesUseCase,
    GetRateLimitRuleUseCase,
    UpdateRateLimitRuleUseCase,
    DeleteRateLimitRuleUseCase,
  ],
  exports: [RateLimitRepository],
})
export class RateLimitsModule {}
