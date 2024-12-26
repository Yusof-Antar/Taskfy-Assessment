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
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('show/:id')
  @UseGuards(AuthGuard)
  async getProfile(@Param('id') id: string) {
    return await this.userService.getProfile(id);
  }

  @Get('employee')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async getAllEmployees(@Req() req: any) {
    return await this.userService.getAllEmployees(req.user.id);
  }

  @Post('add-employee')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async addEmployee(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: any,
  ) {
    return await this.userService.addEmployee(
      name,
      email,
      password,
      req.user.id,
    );
  }

  @Post('edit-employee/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async editEmployee(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: any,
  ) {
    return await this.userService.editEmployee(
      name,
      email,
      password,
      id,
      req.user.id,
    );
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role('MANAGER')
  async deleteEmployee(@Param('id') id: string, @Req() req: any) {
    return await this.userService.deleteEmployee(id, req.user.id);
  }
}
