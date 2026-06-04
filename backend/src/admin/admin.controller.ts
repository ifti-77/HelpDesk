import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe, } from '@nestjs/common';
import type { Request } from 'express';

import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { EmployeeUpdateDto } from '../employee/DTOs/employeeUpdate.dto';
import { TicketCreateDto } from '../employee/DTOs/ticketCreate.dto';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';
import { UserEntity, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './DTOs/createUser.dto';

interface AuthRequest extends Request {
  user: { id: string; role: string };
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

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
  CreateUser(@Body() userData: CreateUserDto, @Req() request: AuthRequest) {
    return this.adminService.CreateUser(request.user.id, userData);
  }

  @Get('users')
  @UseGuards(AdminGuard)
  GetUsers(@Req() request: AuthRequest):Promise<UserEntity[] | null> {
    return this.adminService.GetUsers(request.user.id);
  }

  @Get('users/:userEmail')
  @UseGuards(AdminGuard)
  GetUserByEmail(
    @Param('userEmail') userEmail: string,
    @Req() request: AuthRequest,
  ):Promise<UserEntity[] | null> 
  {
    return this.adminService.GetUserByEmail(request.user.id, userEmail);
  }

  @Get('users/role/:role')
  @UseGuards(AdminGuard)
  GetUserByRole(
    @Param('role') role: UserRole,
    @Req() request: AuthRequest,
  ):Promise<UserEntity[] | null> 
  {
    return this.adminService.GetUserByRole(role);
  }

  @Patch('users/resetpassword/:userId')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  ResetUserPassword(
    @Param('userId') userId: string,
    @Body('password') resetPassword: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.ResetUserPassword(
      request.user.id,
      userId,
      resetPassword,
    )
  }

  @Patch('users/role/:userId')
  @UseGuards(AdminGuard)
  UpdateUserRole(
    @Param('userId') userId: string,
    @Body('role') role: UserRole,
    @Req() request: AuthRequest,
  ):Promise<UserEntity> {
    return this.adminService.UpdateUserRole(request.user.id, userId, role);
  }

  @Patch('users/status/:userId')
  @UseGuards(AdminGuard)
  ActivateUserStatus(
    @Param('userId') userId: string,
    @Req() request: AuthRequest,
  ):Promise<UserEntity> {
    return this.adminService.ActivateUserStatus(
      request.user.id,
      userId,
    )
  }

  @Delete('users/:userId')
  @UseGuards(AdminGuard)
  DeactivateUser(
    @Param('userId') userId: string,
    @Req() request: AuthRequest,
  ):Promise<boolean> {
    return this.adminService.DeactivateUser(request.user.id, userId);
  }

  @Get('tickets')
  @UseGuards(AdminGuard)
  GetAllTickets(@Req() request: AuthRequest) {
    return this.adminService.GetAllTickets();
  }

  @Get('tickets/status/:status')
  @UseGuards(AdminGuard)
  GetTicketsByStatus(
    @Param('status') status: TicketStatus,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.GetTicketsByStatus(status);
  }

  @Get('tickets/:ticketId')
  @UseGuards(AdminGuard)
  GetTicket(
    @Param('ticketId') ticketId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.GetTicket( ticketId);
  }




  @Patch('tickets/assign/:ticketId')
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



 

  @Post('tickets/comments/:ticketId')
  @UseGuards(AdminGuard)
  CreateComment(
    @Param('ticketId') ticketId: string,
    @Body('comment') comment: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.CreateComment(request.user.id, ticketId, comment);
  }

  @Patch('tickets/comments/:ticketId/:commentId')
  @UseGuards(AdminGuard)
  EditComment(
    @Param('ticketId') ticketId: string,
    @Param('commentId') commentId: string,
    @Body('comment') newComment: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.EditComment(request.user.id, ticketId, commentId, newComment);
  }

  @Delete('tickets/comments/')
  @UseGuards(AdminGuard)
  DeleteComment(
    @Query('ticketId') ticketId: string,
    @Query('commentId') commentId: string,
    @Req() request: AuthRequest,
  ) {
    return this.adminService.DeleteComment(
      ticketId,
      commentId,
    );
  }

  @Get('resource-counts')
  @UseGuards(AdminGuard)
  GetAllResourceCounts(@Req() request: AuthRequest): Promise<{
    numberOfUser: number,
    numberOfOpenTicket: number,
    numberOfResolvedTicket: number,
    numberOfTicket: number
  }> {
    return this.adminService.GetAllResourceCounts(request.user.id)
  }
}