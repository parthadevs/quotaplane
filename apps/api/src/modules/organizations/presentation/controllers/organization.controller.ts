import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { CreateOrganizationDto } from '../../application/dto/create-organization.dto';
import { OrganizationResponseDto } from '../../application/dto/organization-response.dto';
import type { UpdateOrganizationDto } from '../../application/dto/update-organization.dto';
import { CreateOrganizationUseCase } from '../../application/use-cases/create-organization.use-case';
import { DeleteOrganizationUseCase } from '../../application/use-cases/delete-organization.use-case';
import { GetOrganizationUseCase } from '../../application/use-cases/get-organization.use-case';
import { ListOrganizationsUseCase } from '../../application/use-cases/list-organizations.use-case';
import { UpdateOrganizationUseCase } from '../../application/use-cases/update-organization.use-case';
import type { AuthenticatedRequest } from '../guards/authenticated-request';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OrganizationGuard } from '../guards/organization.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(
    private readonly createOrganization: CreateOrganizationUseCase,
    private readonly listOrganizations: ListOrganizationsUseCase,
    private readonly getOrganization: GetOrganizationUseCase,
    private readonly updateOrganization: UpdateOrganizationUseCase,
    private readonly deleteOrganization: DeleteOrganizationUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateOrganizationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const organization = await this.createOrganization.execute(
      dto,
      this.actorId(request),
    );

    return {
      data: OrganizationResponseDto.fromEntity(organization),
    };
  }

  @Get()
  async list() {
    const organizations = await this.listOrganizations.execute();
    return {
      data : organizations.map(OrganizationResponseDto.fromEntity)
    }
  }

  @Get(':organizationId')
  @UseGuards(OrganizationGuard)
  async getById(@Param('organizationId') organizationId: string) {
    return OrganizationResponseDto.fromEntity(
      await this.getOrganization.execute(organizationId),
    );
  }

  @Patch(':organizationId')
  @UseGuards(OrganizationGuard)
  async update(
    @Param('organizationId') organizationId: string,
    @Body() dto: UpdateOrganizationDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return OrganizationResponseDto.fromEntity(
      await this.updateOrganization.execute(
        organizationId,
        this.actorId(request),
        dto,
      ),
    );
  }

  @Delete(':organizationId')
  @UseGuards(OrganizationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('organizationId') organizationId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.deleteOrganization.execute(
      organizationId,
      this.actorId(request),
    );
  }
  private actorId(request: AuthenticatedRequest): string {
    return request.user!.id;
  }
}
