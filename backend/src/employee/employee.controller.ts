import { Body, Controller, Get, Param, Post, Put, Patch, UseGuards, UsePipes, ValidationPipe, Req, Delete } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { UserEntity } from "../entities/user.entity";
import { EmployeeUpdateDto } from "./DTOs/employeeUpdate.dto";
import { TicketCreateDto } from "./DTOs/ticketCreate.dto";
import { TicketEntity } from "../entities/ticket.entity";
import { EmployeeGuard } from "./employee.guard";
import type { Request } from "express";

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
        return this.employeeService.GetTickets(request.user.id );
    }

    @Get("/tickets/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    GetTicket(@Param('ticketId') ticketId: string, @Req() request: AuthRequest): Promise<TicketEntity | null> {
        return this.employeeService.GetTicket(request.user.id ,ticketId);
    }

    @Patch("/tickets/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    UpdateTicket(@Param('ticketId') ticketId: string, @Body() updatedTicket: TicketCreateDto, @Req() request: AuthRequest): Promise<TicketEntity | null> {
        return this.employeeService.UpdateTicket(request.user.id ,ticketId, updatedTicket);
    }

    @Delete("/tickets/:ticketId")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    DeleteTicket(@Param('ticketId') ticketId: string, @Req() request: AuthRequest): Promise<boolean> {
        return this.employeeService.DeleteTicket(request.user.id ,ticketId);
    }

    @Post("/tickets/:ticketId/comments")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    CreateComment(@Param('ticketId') ticketId: string, @Body('comment') comment: string, @Req() request: AuthRequest): Promise<boolean> {
        return this.employeeService.CreateComment(request.user.id ,ticketId, comment);
    }

    @Get("/tickets/:ticketId/comments")
    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    GetComments(@Param('ticketId') ticketId: string, @Req() request: AuthRequest): Promise<string[] | null> {
        return this.employeeService.GetComments(request.user.id ,ticketId);
    }

    @UseGuards(EmployeeGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Delete("/tickets/:ticketId/comments/:commentId")
    DeleteComment(@Param('ticketId') ticketId: string, @Param('commentId') commentId: string,  @Req() request: AuthRequest): Promise<boolean> {
        return this.employeeService.DeleteComment(request.user.id ,ticketId, commentId);
    }
}