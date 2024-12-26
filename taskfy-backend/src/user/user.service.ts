import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          subordinates: true,
        },
      });
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Employee Not Found',
      };
    }
  }

  async getAllEmployees(id: string) {
    try {
      const user = await this.prisma.user.findMany({
        where: { managerId: parseInt(id) },

        select: {
          id: true,
          name: true,
          email: true,
          availability: {
            orderBy: {
              availableDate: 'asc',
            },
          },
        },
      });
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Not Authorized',
      };
    }
  }

  async addEmployee(
    name: string,
    email: string,
    password: string,
    managerId: string,
  ) {
    try {
      if (!name) {
        return {
          success: false,
          message: 'Please Employee name',
        };
      }
      if (!email) {
        return {
          success: false,
          message: 'Please Employee email',
        };
      }
      if (!password) {
        return {
          success: false,
          message: 'Please Employee password',
        };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          managerId: parseInt(managerId),
          role: 'EMPLOYEE',
        },
        select: {
          id: true,
          name: true,
          email: true,
          availability: true,
        },
      });
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't Add New Employee! Try Again Later.",
      };
    }
  }
  async editEmployee(
    name: string,
    email: string,
    password: string,
    id: string,
    managerId: string,
  ) {
    try {
      let hashedPassword = '';
      const user = await this.prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (user.managerId !== parseInt(managerId)) {
        return {
          success: false,
          message: 'This is Not your Employee',
        };
      }

      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const newUser = await this.prisma.user.update({
        data: {
          name: name ?? user.name,
          email: email ?? user.email,
          password: hashedPassword ?? user.password,
        },
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          email: true,
          availability: true,
        },
      });

      return {
        success: true,
        data: newUser,
      };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't Edit Employee! Try Again Later.",
      };
    }
  }

  async deleteEmployee(id: string, managerId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      console.log(user.managerId);
      console.log(managerId);

      if (user.managerId != parseInt(managerId)) {
        return {
          success: false,
          message: 'This is Not your Employee',
        };
      }
      await this.prisma.user.delete({ where: { id: parseInt(id) } });
      return { success: true, message: 'Employee Deleted Successfully' };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't Delete Employee! Try Again Later.",
      };
    }
  }
}
