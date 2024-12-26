import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { generateToken } from './jwt/jwt.utils';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(name: string, email: string, password: string) {
    if (!name) {
      return {
        success: false,
        message: 'Please Enter your name',
      };
    }
    if (!email) {
      return {
        success: false,
        message: 'Please Enter your email',
      };
    }
    if (!password) {
      return {
        success: false,
        message: 'Please Enter your password',
      };
    }
    if (await this.prisma.user.findUnique({ where: { email: email } })) {
      return {
        success: false,
        message: 'Please Choose Another Email',
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'EMPLOYEE',
      },
    });
    return { success: true, data: user };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { manager: true },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: 'Invalid Cridentials' };
    }

    const token = generateToken(user);
    return { success: true, user, token };
  }
}
