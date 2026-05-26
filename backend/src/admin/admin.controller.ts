import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { EmployeeUpdateDto } from '../employee/DTOs/employeeUpdate.dto';
import { TicketCreateDto } from '../employee/DTOs/ticketCreate.dto';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';
import { UserRole } from '../entities/user.entity';

interface AuthRequest extends Request {
  user: { id: string; role: string };
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profile')
  @UseGuards(AdminGuard)
  GetAdminProfile(@Req() request: AuthRequest) {
    return this.adminService.GetAdminProfile(request.user.id);
  }

  @Put('profile')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  UpdateAdminProfile(
    @Body() updatedAdmin: EmployeeUpdateDto,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateAdminProfile(request.user.id, updatedAdmin);
  }

  @Patch('profile/password')
  @UseGuards(AdminGuard)
  UpdateAdminPassword(
    @Body('password') updatepassword: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateAdminPassword(
      request.user.id,
      updatepassword,
    );
  }

  @Post('users')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  CreateUser(@Body() userData: any, @Req() request: AuthRequest) {
    return this.adminService.CreateUser(request.user.id, userData);
  }

  @Get('users')
  @UseGuards(AdminGuard)
  GetUsers(@Req() request: AuthRequest) {
    return this.adminService.GetUsers(request.user.id);
  }

  @Get('users/:userId')
  @UseGuards(AdminGuard)
  GetUser(
    @Param('userId') userId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.GetUser(request.user.id, userId);
  }

  @Patch('users/:userId')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  UpdateUser(
    @Param('userId') userId: string,
    @Body() updatedUser: EmployeeUpdateDto,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateUser(
      request.user.id,
      userId,
      updatedUser,
    );
  }

  @Patch('users/:userId/role')
  @UseGuards(AdminGuard)
  UpdateUserRole(
    @Param('userId') userId: string,
    @Body('role') role: UserRole,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateUserRole(request.user.id, userId, role);
  }

  @Patch('users/:userId/status')
  @UseGuards(AdminGuard)
  UpdateUserStatus(
    @Param('userId') userId: string,
    @Body('isActive') isActive: boolean,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateUserStatus(
      request.user.id,
      userId,
      isActive,
    );
  }

  @Delete('users/:userId')
  @UseGuards(AdminGuard)
  DeleteUser(
    @Param('userId') userId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.DeleteUser(request.user.id, userId);
  }

  @Get('tickets')
  @UseGuards(AdminGuard)
  GetAllTickets(@Req() request: AuthRequest) {
    return this.adminService.GetAllTickets(request.user.id);
  }

  @Get('tickets/:ticketId')
  @UseGuards(AdminGuard)
  GetTicket(
    @Param('ticketId') ticketId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.GetTicket(request.user.id, ticketId);
  }

  @Patch('tickets/:ticketId')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  UpdateTicket(
    @Param('ticketId') ticketId: string,
    @Body() updatedTicket: TicketCreateDto,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateTicket(
      request.user.id,
      ticketId,
      updatedTicket,
    );
  }

  @Patch('tickets/:ticketId/status')
  @UseGuards(AdminGuard)
  UpdateTicketStatus(
    @Param('ticketId') ticketId: string,
    @Body('status') status: TicketStatus,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateTicketStatus(
      request.user.id,
      ticketId,
      status,
    );
  }

  @Patch('tickets/:ticketId/assign')
  @UseGuards(AdminGuard)
  AssignTicket(
    @Param('ticketId') ticketId: string,
    @Body('assignedToId') assignedToId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.AssignTicket(
      request.user.id,
      ticketId,
      assignedToId,
    );
  }

  @Patch('tickets/:ticketId/priority')
  @UseGuards(AdminGuard)
  UpdateTicketPriority(
    @Param('ticketId') ticketId: string,
    @Body('priority') priority: TicketPriority,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.UpdateTicketPriority(
      request.user.id,
      ticketId,
      priority,
    );
  }

  @Delete('tickets/:ticketId')
  @UseGuards(AdminGuard)
  DeleteTicket(
    @Param('ticketId') ticketId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.DeleteTicket(request.user.id, ticketId);
  }

  @Post('tickets/:ticketId/comments')
  @UseGuards(AdminGuard)
  CreateComment(
    @Param('ticketId') ticketId: string,
    @Body('comment') comment: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.CreateComment(request.user.id, ticketId, comment);
  }

  @Get('tickets/:ticketId/comments')
  @UseGuards(AdminGuard)
  GetComments(
    @Param('ticketId') ticketId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.GetComments(request.user.id, ticketId);
  }

  @Delete('tickets/:ticketId/comments/:commentId')
  @UseGuards(AdminGuard)
  DeleteComment(
    @Param('ticketId') ticketId: string,
    @Param('commentId') commentId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.DeleteComment(
      request.user.id,
      ticketId,
      commentId,
    );
  }
}