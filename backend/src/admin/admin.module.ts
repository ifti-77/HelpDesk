import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';

import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../entities/user.entity';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketCommentEntity } from '../entities/ticketComment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TicketEntity,
      TicketCommentEntity,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}