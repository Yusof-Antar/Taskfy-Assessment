import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.decorator';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  async addAvailability(
    @Body('availableDate') availableDate: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Req() req: any,
  ) {
    return await this.availabilityService.addAvailability(
      req.user.id,
      availableDate,
      startTime,
      endTime,
    );
  }

  @Get('get-availability')
  @UseGuards(AuthGuard)
  async getAvailability(@Req() req: any) {
    return await this.availabilityService.getAvailability(req.user.id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async deleteAvailability(
    @Param("id") id:string,
    @Req() req: any,
  ) {
    return await this.availabilityService.deleteAvailability(id, req.user.id)
  }
}
