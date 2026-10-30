import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../organizations/presentation/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../organizations/presentation/guards/organization.guard';
import {
  RecordUsageUseCase,
  ListUsageUseCase,
} from '../../application/use-cases';
import {
  RecordUsageDto,
  UsageRecordResponseDto,
} from '../../application/dto';

@Controller('organizations/:organizationId/usage')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class UsageController {
  constructor(
    private readonly recordUsageUseCase: RecordUsageUseCase,
    private readonly listUsageUseCase: ListUsageUseCase,
  ) {}

  @Post()
  async recordUsage(
    @Param('organizationId') organizationId: string,
    @Body() dto: RecordUsageDto,
  ) {
    const record = await this.recordUsageUseCase.execute(organizationId, dto);
    return UsageRecordResponseDto.fromEntity(record);
  }

  @Get()
  async listUsage(
    @Param('organizationId') organizationId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    const records = await this.listUsageUseCase.execute(
      organizationId,
      parsedLimit,
      parsedOffset,
    );
    return {
      data: records.map((r) => UsageRecordResponseDto.fromEntity(r)),
    };
  }
}
