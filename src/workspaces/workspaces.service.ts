import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceInput, UpdateWorkspaceInput } from './dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async create(createWorkspaceInput: CreateWorkspaceInput): Promise<Workspace> {
    const { name, description } = createWorkspaceInput;
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    // Check if slug already exists
    const existingWorkspace = await this.workspaceRepository.findOne({ where: { slug } });
    if (existingWorkspace) {
      throw new ConflictException('Workspace name already exists');
    }

    const workspace = this.workspaceRepository.create({
      name,
      slug,
      description,
    });

    return this.workspaceRepository.save(workspace);
  }

  async findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find({
      relations: ['users'],
      where: { active: true },
    });
  }

  async findOne(id: number): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, active: true },
      relations: ['users'],
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async findBySlug(slug: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { slug, active: true },
      relations: ['users'],
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async update(id: number, updateWorkspaceInput: UpdateWorkspaceInput): Promise<Workspace> {
    const workspace = await this.findOne(id);
    
    if (updateWorkspaceInput.name) {
      const slug = updateWorkspaceInput.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const existingWorkspace = await this.workspaceRepository.findOne({ 
        where: { slug } 
      });
      
      if (existingWorkspace && existingWorkspace.id !== id) {
        throw new ConflictException('Workspace name already exists');
      }
      
      workspace.slug = slug;
    }

    Object.assign(workspace, updateWorkspaceInput);
    return this.workspaceRepository.save(workspace);
  }

  async remove(id: number): Promise<boolean> {
    const workspace = await this.findOne(id);
    workspace.active = false;
    await this.workspaceRepository.save(workspace);
    return true;
  }
}