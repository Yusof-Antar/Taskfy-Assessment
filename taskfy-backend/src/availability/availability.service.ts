import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async addAvailability(
    id: string,
    availableDate: string,
    startTime: string,
    endTime: string,
  ) {
    try {
      const availableDateTime = new Date(availableDate);

      if (isNaN(availableDateTime.getTime())) {
        return {
          success: false,
          message: 'Invalid Date format for availableDate. Use YYYY-MM-DD.',
        };
      }

      const availableDateOnly = availableDateTime.toISOString().split('T')[0];

      const startDateTime = new Date(`${availableDateOnly}T${startTime}`);
      const endDateTime = new Date(`${availableDateOnly}T${endTime}`);

      console.log('HERE');
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return {
          success: false,
          message:
            'Invalid Time format for startTime or endTime. Use HH:mm:ss.',
        };
      }
      const availability = await this.prisma.availability.create({
        data: {
          employeeId: parseInt(id),
          availableDate: availableDateTime,
          startTime: startDateTime,
          endTime: endDateTime,
        },
      });

      return {
        success: true,
        data: availability,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  async getAvailability(id: string) {
    try {
      const availabilities = await this.prisma.availability.findMany({
        where: { employeeId: parseInt(id) },
        orderBy: {
          availableDate: 'asc',
        },
      });

      return {
        success: true,
        data: availabilities,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  async deleteAvailability(id: string, employeeId: string) {
    try {
      const employee = await this.prisma.user.findUnique({
        where: { id: parseInt(employeeId) },
        include: { availability: true },
      });
      if (!employee) {
        return {
          success: false,
          message: 'No Such User',
        };
      }

      if (
        !employee.availability.some(
          (available) => available.id.toString() == id,
        )
      ) {
        return {
          success: false,
          message: 'There is no such Availability',
        };
      }

      await this.prisma.availability.delete({
        where: { id: parseInt(id) },
      });
      return {
        success: true,
        message: 'Availability Deleted Successfully',
      };
    } catch (error) {
      return { success: false, message: error };
    }
  }
}
