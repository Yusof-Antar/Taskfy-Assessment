import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { AvailabilityModule } from './availability/availability.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ProjectModule, AvailabilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}