import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../organizations/presentation/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../organizations/presentation/guards/organization.guard';
import {
  GetQuotaUseCase,
  SetQuotaUseCase,
  UpdateQuotaUseCase,
  CheckQuotaUseCase,
  ResetQuotaUseCase,
} from '../../application/use-cases';
import {
  SetQuotaDto,
  UpdateQuotaDto,
  CheckQuotaDto,
  QuotaResponseDto,
} from '../../application/dto';

@Controller('organizations/:organizationId/quota')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class QuotaController {
  constructor(
    private readonly getQuotaUseCase: GetQuotaUseCase,
    private readonly setQuotaUseCase: SetQuotaUseCase,
    private readonly updateQuotaUseCase: UpdateQuotaUseCase,
    private readonly checkQuotaUseCase: CheckQuotaUseCase,
    private readonly resetQuotaUseCase: ResetQuotaUseCase,
  ) {}

  @Get()
  async getQuota(@Param('organizationId') organizationId: string) {
    const quota = await this.getQuotaUseCase.execute(organizationId);
    return QuotaResponseDto.fromEntity(quota);
  }

  @Put()
  async setQuota(
    @Param('organizationId') organizationId: string,
    @Body() dto: SetQuotaDto,
  ) {
    const quota = await this.setQuotaUseCase.execute(organizationId, dto);
    return QuotaResponseDto.fromEntity(quota);
  }

  @Patch()
  async updateQuota(
    @Param('organizationId') organizationId: string,
    @Body() dto: UpdateQuotaDto,
  ) {
    const quota = await this.updateQuotaUseCase.execute(organizationId, dto);
    return QuotaResponseDto.fromEntity(quota);
  }

  @Post('check')
  async checkQuota(
    @Param('organizationId') organizationId: string,
    @Body() dto: CheckQuotaDto,
  ) {
    return this.checkQuotaUseCase.execute(organizationId, dto.cost ?? 1);
  }

  @Post('reset')
  async resetQuota(@Param('organizationId') organizationId: string) {
    const quota = await this.resetQuotaUseCase.execute(organizationId);
    return QuotaResponseDto.fromEntity(quota);
  }
}
