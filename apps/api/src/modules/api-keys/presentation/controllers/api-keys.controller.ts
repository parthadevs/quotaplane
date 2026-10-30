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
import { CreateApiKeyDto, UpdateApiKeyDto, ApiKeyResponseDto } from '../../application/dto';
import {
  CreateApiKeyUseCase,
  ListApiKeysUseCase,
  GetApiKeyUseCase,
  UpdateApiKeyUseCase,
  RevokeApiKeyUseCase,
  RotateApiKeyUseCase,
} from '../../application/use-cases';
import { JwtAuthGuard } from '../../../organizations/presentation/guards/jwt-auth.guard';
import { OrganizationGuard } from '../../../organizations/presentation/guards/organization.guard';

@Controller('organizations/:organizationId/api-keys')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class ApiKeysController {
  constructor(
    private readonly createApiKeyUseCase: CreateApiKeyUseCase,
    private readonly listApiKeysUseCase: ListApiKeysUseCase,
    private readonly getApiKeyUseCase: GetApiKeyUseCase,
    private readonly updateApiKeyUseCase: UpdateApiKeyUseCase,
    private readonly revokeApiKeyUseCase: RevokeApiKeyUseCase,
    private readonly rotateApiKeyUseCase: RotateApiKeyUseCase,
  ) {}

  @Post()
  async create(
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.createApiKeyUseCase.execute(organizationId, dto);
  }

  @Get()
  async list(@Param('organizationId') organizationId: string) {
    const keys = await this.listApiKeysUseCase.execute(organizationId);
    return {
      data: keys.map((key) => ApiKeyResponseDto.fromEntity(key)),
    };
  }

  @Get(':keyId')
  async getById(
    @Param('organizationId') organizationId: string,
    @Param('keyId') keyId: string,
  ) {
    const key = await this.getApiKeyUseCase.execute(organizationId, keyId);
    return ApiKeyResponseDto.fromEntity(key);
  }

  @Patch(':keyId')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('keyId') keyId: string,
    @Body() dto: UpdateApiKeyDto,
  ) {
    const key = await this.updateApiKeyUseCase.execute(organizationId, keyId, dto);
    return ApiKeyResponseDto.fromEntity(key);
  }

  @Delete(':keyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(
    @Param('organizationId') organizationId: string,
    @Param('keyId') keyId: string,
  ): Promise<void> {
    await this.revokeApiKeyUseCase.execute(organizationId, keyId);
  }

  @Post(':keyId/rotate')
  async rotate(
    @Param('organizationId') organizationId: string,
    @Param('keyId') keyId: string,
  ) {
    return this.rotateApiKeyUseCase.execute(organizationId, keyId);
  }
}
