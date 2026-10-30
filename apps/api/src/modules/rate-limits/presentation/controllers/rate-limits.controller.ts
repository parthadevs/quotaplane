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
  CreateRateLimitRuleUseCase,
  ListRateLimitRulesUseCase,
  GetRateLimitRuleUseCase,
  UpdateRateLimitRuleUseCase,
  DeleteRateLimitRuleUseCase,
} from '../../application/use-cases';
import {
  CreateRateLimitRuleDto,
  UpdateRateLimitRuleDto,
  RateLimitRuleResponseDto,
} from '../../application/dto';

@Controller('organizations/:organizationId/rate-limits')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class RateLimitsController {
  constructor(
    private readonly createRuleUseCase: CreateRateLimitRuleUseCase,
    private readonly listRulesUseCase: ListRateLimitRulesUseCase,
    private readonly getRuleUseCase: GetRateLimitRuleUseCase,
    private readonly updateRuleUseCase: UpdateRateLimitRuleUseCase,
    private readonly deleteRuleUseCase: DeleteRateLimitRuleUseCase,
  ) {}

  @Post()
  async create(
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateRateLimitRuleDto,
  ) {
    const rule = await this.createRuleUseCase.execute(organizationId, dto);
    return RateLimitRuleResponseDto.fromEntity(rule);
  }

  @Get()
  async list(@Param('organizationId') organizationId: string) {
    const rules = await this.listRulesUseCase.execute(organizationId);
    return {
      data: rules.map((r) => RateLimitRuleResponseDto.fromEntity(r)),
    };
  }

  @Get(':ruleId')
  async getById(
    @Param('organizationId') organizationId: string,
    @Param('ruleId') ruleId: string,
  ) {
    const rule = await this.getRuleUseCase.execute(organizationId, ruleId);
    return RateLimitRuleResponseDto.fromEntity(rule);
  }

  @Patch(':ruleId')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('ruleId') ruleId: string,
    @Body() dto: UpdateRateLimitRuleDto,
  ) {
    const rule = await this.updateRuleUseCase.execute(organizationId, ruleId, dto);
    return RateLimitRuleResponseDto.fromEntity(rule);
  }

  @Delete(':ruleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('organizationId') organizationId: string,
    @Param('ruleId') ruleId: string,
  ): Promise<void> {
    await this.deleteRuleUseCase.execute(organizationId, ruleId);
  }
}
