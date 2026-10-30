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
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AddMemberDto } from '../../application/dto/add-member.dto';
import type { UpdateMemberRoleDto } from '../../application/dto/update-member-role.dto';
import { AddMemberUseCase } from '../../application/use-cases/add-member.use-case';
import { ListMembersUseCase } from '../../application/use-cases/list-members.use-case';
import { RemoveMemberUseCase } from '../../application/use-cases/remove-member.use-case';
import { UpdateMemberRoleUseCase } from '../../application/use-cases/update-member-role.use-case';
import type { AuthenticatedRequest } from '../guards/authenticated-request';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OrganizationGuard } from '../guards/organization.guard';
import { OrganizationMemberGuard } from '../guards/organization-member.guard';

@Controller('organizations/:organizationId/members')
@UseGuards(JwtAuthGuard, OrganizationGuard)
export class OrganizationMembersController {
  constructor(
    private readonly listMembers: ListMembersUseCase,
    private readonly addMember: AddMemberUseCase,
    private readonly removeMember: RemoveMemberUseCase,
    private readonly updateMemberRole: UpdateMemberRoleUseCase,
  ) {}

  @Get()
  list(@Param('organizationId') organizationId: string) {
    return this.listMembers.execute(organizationId);
  }

  @Post()
  create(
    @Param('organizationId') organizationId: string,
    @Body() dto: AddMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.addMember.execute(
      organizationId,
      this.actorId(request),
      dto.userId,
      dto.role,
    );
  }

  @Patch(':memberId')
  @UseGuards(OrganizationMemberGuard)
  async update(
    @Param('organizationId') organizationId: string,
    @Body() dto: UpdateMemberRoleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateMemberRole.execute(
      organizationId,
      this.actorId(request),
      request.organizationMember!.userId,
      dto,
    );
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OrganizationMemberGuard)
  async delete(
    @Param('organizationId') organizationId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.removeMember.execute(
      organizationId,
      this.actorId(request),
      request.organizationMember!.userId,
    );
  }

  private actorId(request: AuthenticatedRequest): string {
    return request.user!.id;
  }
}
