import { Body, Controller, Get, Param, Post, Put, Patch, UseGuards, UsePipes, ValidationPipe, Req, Delete, Query } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { UserEntity } from "../entities/user.entity";
import { EmployeeUpdateDto } from "./DTOs/employeeUpdate.dto";
import { TicketCreateDto } from "./DTOs/ticketCreate.dto";
import { TicketEntity, TicketStatus } from "../entities/ticket.entity";
import { EmployeeGuard } from "./employee.guard";
import type { Request } from "express";
import { TicketCommentEntity } from "src/entities/ticketComment.entity";
import { TicketUpdateDto } from "./DTOs/ticketUpdate.dto";

interface AuthRequest extends Request {
    user: { id: string };
}


@Controller('employee')
export class EmployeeController {

    constructor(private readonly employeeService: EmployeeService) { }

    @Get("/profile")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    GetEmployeeProfile(@Req() request: AuthRequest): Promise<UserEntity | null> {
        return this.employeeService.GetEmployeeProfile(request.user.id);
    }


    @Put("/profile")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    UpdateEmployeeProfile(@Body() updatedEmployee: EmployeeUpdateDto, @Req() request: AuthRequest): Promise<UserEntity | null> {
        return this.employeeService.UpdateEmployeeProfile(request.user.id ,updatedEmployee);
    }

    @Patch("/profile/password")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    UpdateEmployeePassword(@Body('password') updatepassword: string, @Req() request: AuthRequest): Promise<UserEntity | null> {
        return this.employeeService.UpdateEmployeePassword(request.user.id ,updatepassword);
    }

    @Post("/tickets")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    CreateTicket(@Body() ticketData: TicketCreateDto, @Req() request: AuthRequest): Promise<TicketEntity | null> {
        return this.employeeService.CreateTicket(request.user.id ,ticketData);
    }

    @Get("/tickets")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    GetTickets(@Req() request: AuthRequest): Promise<TicketEntity[] | null> {
        return this.employeeService.GetOwnTickets(request.user.id );
    }

    @Get("/tickets/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    GetTicket(@Param('ticketId') ticketId: string, @Req() request: AuthRequest): Promise<TicketEntity | null> {
        return this.employeeService.GetTicket(request.user.id ,ticketId);
    }

    @Get("/tickets/status/:status")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    GetTicketsByStatus(@Param('status') status: TicketStatus, @Req() request: AuthRequest): Promise<TicketEntity[] | null> {
        return this.employeeService.GetTicketsByStatus(request.user.id ,status);
    }

    @Put("/tickets/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    UpdateTicket(@Param('ticketId') ticketId: string, @Body() updatedTicket: TicketUpdateDto, @Req() request: AuthRequest): Promise<TicketEntity | null> {
        return this.employeeService.UpdateTicket(request.user.id ,ticketId, updatedTicket);
    }

    @Patch("/tickets/status/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    UpdateTicketStatus(@Param('ticketId') ticketId: string, @Body('status') status: TicketStatus, @Req() request: AuthRequest): Promise<TicketEntity | null> {
        return this.employeeService.UpdateTicketStatus(request.user.id ,ticketId, status);
    }

    @Delete("/tickets/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    DeleteTicket(@Param('ticketId') ticketId: string, @Req() request: AuthRequest): Promise<boolean> {
        return this.employeeService.DeleteTicket(request.user.id ,ticketId);
    }

    @Post("/tickets/comments/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    CreateComment(@Param('ticketId') ticketId: string, 
    @Body('comment') comment: string, @Req() request: AuthRequest): Promise<TicketCommentEntity | null> {
        return this.employeeService.CreateComment(request.user.id ,ticketId, comment);
    }


    
      @Patch('tickets/comments/:ticketId/:commentId')
      @UseGuards(EmployeeGuard)
      EditComment(
        @Param('ticketId') ticketId: string,
        @Param('commentId') commentId: string,
        @Body('comment') newComment: string,
        @Req() request: AuthRequest,
      ): Promise<TicketCommentEntity | null> {
        return this.employeeService.EditComment(request.user.id, ticketId, commentId, newComment);
      }

    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Delete("/tickets/comments/:ticketId/:commentId")
    DeleteComment(@Param('ticketId') ticketId: string, @Param('commentId') commentId: string,  @Req() request: AuthRequest): Promise<boolean> {
        return this.employeeService.DeleteComment(request.user.id ,ticketId, commentId);
    }
}