import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../organizations/presentation/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../organizations/presentation/guards/organization.guard';
import {
  CreateWebhookUseCase,
  ListWebhooksUseCase,
  UpdateWebhookUseCase,
  DeleteWebhookUseCase,
} from '../../application/use-cases';
import {
  CreateWebhookDto,
  UpdateWebhookDto,
  WebhookResponseDto,
} from '../../application/dto';

@Controller('organizations/:organizationId/webhooks')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class WebhooksController {
  constructor(
    private readonly createWebhookUseCase: CreateWebhookUseCase,
    private readonly listWebhooksUseCase: ListWebhooksUseCase,
    private readonly updateWebhookUseCase: UpdateWebhookUseCase,
    private readonly deleteWebhookUseCase: DeleteWebhookUseCase,
  ) {}

  @Post()
  async create(
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateWebhookDto,
  ) {
    const webhook = await this.createWebhookUseCase.execute(organizationId, dto);
    return WebhookResponseDto.fromEntity(webhook);
  }

  @Get()
  async list(@Param('organizationId') organizationId: string) {
    const webhooks = await this.listWebhooksUseCase.execute(organizationId);
    return {
      data: webhooks.map((w) => WebhookResponseDto.fromEntity(w)),
    };
  }

  @Patch(':webhookId')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('webhookId') webhookId: string,
    @Body() dto: UpdateWebhookDto,
  ) {
    const webhook = await this.updateWebhookUseCase.execute(organizationId, webhookId, dto);
    return WebhookResponseDto.fromEntity(webhook);
  }

  @Delete(':webhookId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('organizationId') organizationId: string,
    @Param('webhookId') webhookId: string,
  ): Promise<void> {
    await this.deleteWebhookUseCase.execute(organizationId, webhookId);
  }
}
