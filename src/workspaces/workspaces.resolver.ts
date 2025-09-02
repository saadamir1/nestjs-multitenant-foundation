import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceInput, UpdateWorkspaceInput } from './dto/workspace.dto';

@Resolver(() => Workspace)
@UseGuards(JwtAuthGuard)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  @UseGuards(RolesGuard)
  @Roles('admin')
  createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
  ): Promise<Workspace> {
    return this.workspacesService.create(createWorkspaceInput);
  }

  @Query(() => [Workspace], { name: 'workspaces' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll(): Promise<Workspace[]> {
    return this.workspacesService.findAll();
  }

  @Query(() => Workspace, { name: 'workspace' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Workspace> {
    return this.workspacesService.findOne(id);
  }

  @Query(() => Workspace, { name: 'workspaceBySlug' })
  findBySlug(@Args('slug') slug: string): Promise<Workspace> {
    return this.workspacesService.findBySlug(slug);
  }

  @Query(() => Workspace, { name: 'myWorkspace' })
  async getMyWorkspace(@CurrentUser() user: any): Promise<Workspace> {
    return this.workspacesService.findOne(user.workspaceId);
  }

  @Mutation(() => Workspace)
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateWorkspace(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return this.workspacesService.update(id, updateWorkspaceInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles('admin')
  removeWorkspace(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.workspacesService.remove(id);
  }
}