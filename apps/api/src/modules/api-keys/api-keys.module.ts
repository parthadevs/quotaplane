import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ApiKeyRepository } from './domain/repositories/api-key.repository';
import { PrismaApiKeyRepository } from './infrastructure/persistence/prisma-api-key.repository';
import {
  CreateApiKeyUseCase,
  ListApiKeysUseCase,
  GetApiKeyUseCase,
  UpdateApiKeyUseCase,
  RevokeApiKeyUseCase,
  RotateApiKeyUseCase,
} from './application/use-cases';
import { ApiKeysController } from './presentation/controllers/api-keys.controller';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [ApiKeysController],
  providers: [
    {
      provide: ApiKeyRepository,
      useClass: PrismaApiKeyRepository,
    },
    CreateApiKeyUseCase,
    ListApiKeysUseCase,
    GetApiKeyUseCase,
    UpdateApiKeyUseCase,
    RevokeApiKeyUseCase,
    RotateApiKeyUseCase,
  ],
  exports: [ApiKeyRepository],
})
export class ApiKeysModule {}
