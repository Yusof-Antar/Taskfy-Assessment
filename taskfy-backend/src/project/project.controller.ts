import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('add')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async addProject(
    @Body('name') name: string,
    @Body('allocatedHours') allocatedHours: string,
    @Req() req: any,
  ) {
    return await this.projectService.addProject(
      name,
      allocatedHours,
      req.user.id,
    );
  }

  @Post('edit/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async editProject(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('allocatedHours') allocatedHours: string,
    @Req() req: any,
  ) {
    return await this.projectService.editProject(
      id,
      name,
      allocatedHours,
      req.user.id,
    );
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async deleteProject(@Param('id') id: string, @Req() req: any) {
    return await this.projectService.deleteProject(id, req.user.id);
  }

  @Get('')
  @UseGuards(AuthGuard)
  async showAllProjects(@Req() req: any) {
    return await this.projectService.getAllProjects(req.user.id);
  }

  @Get('show/:id')
  async showProject(@Param('id') id: string) {
    return await this.projectService.showProject(id);
  }

  @Post('close/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async closeProject(@Param('id') id: string, @Req() req: any) {
    return await this.projectService.closeProject(id, req.user.id);
  }

  @Post('log-hours/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('EMPLOYEE')
  async logHours(
    @Param('id') id: string,
    @Body('hours') hours: string,
    @Req() req: any,
  ) {
    return await this.projectService.logHours(id, req.user.id, hours);
  }
}
