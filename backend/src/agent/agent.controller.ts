import {Body,Controller,Delete,Get,Param,Patch,Put,Req,UseGuards,UsePipes,ValidationPipe,Post,} from '@nestjs/common';
import type { Request } from 'express';

import { AgentService } from './agent.service';
import { AgentGuard } from './agent.guard';
import { EmployeeUpdateDto } from '../employee/DTOs/employeeUpdate.dto';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';

interface AuthRequest extends Request {
    user: { id: string; role: string };
}

@Controller('agent')
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Get('profile')
    @UseGuards(AgentGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    GetAgentProfile(@Req() request: AuthRequest) {
        return this.agentService.GetAgentProfile(request.user.id);
    }

    @Put('profile')
    @UseGuards(AgentGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    UpdateAgentProfile(
        @Body() updatedAgent: EmployeeUpdateDto,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.UpdateAgentProfile(request.user.id, updatedAgent);
    }

    @Patch('profile/password')
    @UseGuards(AgentGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    UpdateAgentPassword(
        @Body('password') updatepassword: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.UpdateAgentPassword(
            request.user.id,
            updatepassword,
        );
    }

    @Get('tickets')
    @UseGuards(AgentGuard)
    GetAllTickets(@Req() request: AuthRequest) {
        return this.agentService.GetAllTickets(request.user.id);
    }

    @Get('tickets/assigned-to-me')
    @UseGuards(AgentGuard)
    GetAssignedTickets(@Req() request: AuthRequest) {
        return this.agentService.GetAssignedTickets(request.user.id);
    }

    @Get('tickets/unassigned')
    @UseGuards(AgentGuard)
    GetUnassignedTickets(@Req() request: AuthRequest) {
        return this.agentService.GetUnassignedTickets(request.user.id);
    }

    @Get('tickets/:ticketId')
    @UseGuards(AgentGuard)
    GetTicket(
        @Param('ticketId') ticketId: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.GetTicket(request.user.id, ticketId);
    }

    @Patch('tickets/:ticketId/status')
    @UseGuards(AgentGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    UpdateTicketStatus(
        @Param('ticketId') ticketId: string,
        @Body('status') status: TicketStatus,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.UpdateTicketStatus(
            request.user.id,
            ticketId,
            status,
        );
    }

    @Patch('tickets/:ticketId/assign-to-me')
    @UseGuards(AgentGuard)
    AssignTicketToMe(
        @Param('ticketId') ticketId: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.AssignTicketToMe(request.user.id, ticketId);
    }

    @Patch('tickets/:ticketId/priority')
    @UseGuards(AgentGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    UpdateTicketPriority(
        @Param('ticketId') ticketId: string,
        @Body('priority') priority: TicketPriority,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.UpdateTicketPriority(
            request.user.id,
            ticketId,
            priority,
        );
    }

    @Post('tickets/:ticketId/comments')
    @UseGuards(AgentGuard)
    CreateComment(
        @Param('ticketId') ticketId: string,
        @Body('comment') comment: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.CreateComment(request.user.id, ticketId, comment);
    }

    @Get('tickets/:ticketId/comments')
    @UseGuards(AgentGuard)
    GetComments(
        @Param('ticketId') ticketId: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.GetComments(request.user.id, ticketId);
    }

    @Delete('tickets/:ticketId/comments/:commentId')
    @UseGuards(AgentGuard)
    DeleteComment(
        @Param('ticketId') ticketId: string,
        @Param('commentId') commentId: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.DeleteComment(
            request.user.id,
            ticketId,
            commentId,
        );
    }
}