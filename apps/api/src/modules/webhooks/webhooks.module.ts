import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma';
import { OrganizationsModule } from '../organizations/organizations.module';
import { WebhookRepository } from './domain/repositories/webhook.repository';
import { PrismaWebhookRepository } from './infrastructure/persistence/prisma-webhook.repository';
import {
  CreateWebhookUseCase,
  ListWebhooksUseCase,
  UpdateWebhookUseCase,
  DeleteWebhookUseCase,
} from './application/use-cases';
import { WebhooksController } from './presentation/controllers/webhooks.controller';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [WebhooksController],
  providers: [
    {
      provide: WebhookRepository,
      useClass: PrismaWebhookRepository,
    },
    CreateWebhookUseCase,
    ListWebhooksUseCase,
    UpdateWebhookUseCase,
    DeleteWebhookUseCase,
  ],
  exports: [WebhookRepository],
})
export class WebhooksModule {}
