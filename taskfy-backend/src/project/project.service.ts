import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const nodemailer = require('nodemailer');

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  private transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  private async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async getAllProjects(id: string) {
    try {
      // First, check if the user is an employee or a manager
      const user = await this.prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // If the user is an employee, fetch the projects of their manager
      if (user.role == 'EMPLOYEE') {
        // Assuming there is a relation where the employee has a manager (adminId)
        const managerProjects = await this.prisma.project.findMany({
          where: {
            adminId: user.managerId, // Get projects of the manager
          },
          include: {
            admin: true, // Include manager details if needed
          },
        });

        return {
          success: true,
          data: managerProjects,
        };
      }

      // If the user is a manager, fetch the manager's own projects
      const projects = await this.prisma.project.findMany({
        where: {
          adminId: parseInt(id), // Get projects of the manager
        },
        include: {
          admin: true, // Include manager details if needed
        },
      });

      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't fetch Projects",
      };
    }
  }

  async addProject(name: string, allocatedHours: string, admin: string) {
    try {
      if (!name) {
        return {
          success: false,
          message: 'Please Enter a Project Name',
        };
      }
      if (!allocatedHours) {
        return {
          success: false,
          message: 'Please Enter a Project Allocated Hours',
        };
      }

      const project = await this.prisma.project.create({
        data: {
          name,
          allocatedHours: parseFloat(allocatedHours),
          adminId: parseInt(admin),
        },
        include: {
          admin: true,
        },
      });
      return {
        success: true,
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't Add a New Project! Try Again Later.",
      };
    }
  }

  async editProject(
    id: string,
    name: string,
    allocatedHours: string,
    admin: string,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (!project) {
      return {
        success: false,
        message: 'Project not Found!',
      };
    }
    if (project.adminId !== parseInt(admin)) {
      return {
        success: false,
        message: 'You are Not Authorized to Edit This Project',
      };
    }

    try {
      const updatedProject = await this.prisma.project.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: name || project.name,
          allocatedHours: parseFloat(allocatedHours) || project.allocatedHours,
        },
      });
      return {
        success: true,
        data: updatedProject,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  async deleteProject(id: string, admin: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (!project) {
      return {
        success: false,
        message: 'Project not Found!',
      };
    }
    if (project.adminId !== parseInt(admin)) {
      return {
        success: false,
        message: 'You are Not Authorized to Edit This Project',
      };
    }
    try {
      await this.prisma.project.delete({ where: { id: parseInt(id) } });
      return {
        success: true,
        message: 'Delete Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't Delete This Project",
      };
    }
  }

  async showProject(id: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id: 2,
        },
        include: {
          admin: {
            include: {
              subordinates: true,
            },
          },
        },
      });

      return {
        success: true,
        data: project,
      };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't Find The Project",
      };
    }
  }

  async closeProject(id: string, admin: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (!project) {
      return {
        success: false,
        message: 'Project not Found!',
      };
    }
    if (project.adminId !== parseInt(admin)) {
      return {
        success: false,
        message: 'You are Not Authorized to Edit This Project',
      };
    }
    try {
      await this.prisma.project.update({
        where: { id: parseInt(id) },
        data: {
          status: 'CLOSED',
        },
      });
      return {
        success: true,
        message: 'Closed Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: "Couldn't Delete This Project",
      };
    }
  }

  async logHours(id: string, userId: string, hours: string) {
    if (!hours) {
      return {
        success: false,
        message: 'Please Enter How Much Hours',
      };
    }
    const project = await this.prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        admin: {
          include: {
            subordinates: true,
          },
        },
      },
    });

    if (!project) {
      return { success: false, message: 'There is No Project' };
    }
    if (project.status === 'CLOSED') {
      return {
        success: false,
        message: 'This Project is Already Closed',
      };
    }
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return {
        success: false,
        message: 'There is no Such User',
      };
    }

    // Check if the user is a subordinate of the project's admin
    const isSubordinate = project.admin.subordinates.some(
      (subordinate) => subordinate.id === user.id,
    );

    if (!isSubordinate) {
      return {
        success: false,
        message: 'This employee is not a subordinate of the project admin',
      };
    }
    await this.prisma.hour.create({
      data: {
        employeeId: parseInt(userId),
        projectId: parseInt(id),
        loggedDate: new Date(),
        loggedHours: parseFloat(hours),
      },
    });

    const newProject = await this.prisma.project.update({
      where: {
        id: parseInt(id),
      },
      data: {
        consumedHours: project.consumedHours + parseFloat(hours),
      },
    });

    if (newProject.consumedHours >= project.allocatedHours) {
      await this.closeProject(id, newProject.adminId.toString());
      const adminEmail = project.admin.email; // Get the project admin's email
      const subject = `Project ${newProject.name} is Closed`;
      const text = `Dear ${project.admin.name},\n\nThe project "${newProject.name}" has been completed, and all allocated hours have been consumed.\n\nBest regards,\nYour Team`;
      newProject.status = 'CLOSED';
      // Send email to the admin
      await this.sendEmail(adminEmail, subject, text);
    }

    return { success: true, data: newProject };
  }
}
