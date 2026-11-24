import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';

import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../entities/user.entity';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketCommentEntity } from '../entities/ticketComment.entity';
import { OrganizationEntity } from 'src/entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TicketEntity,
      TicketCommentEntity,
      OrganizationEntity,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}