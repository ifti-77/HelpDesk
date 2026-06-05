import {Body,Controller,Delete,Get,Param,Patch,Put,Req,UseGuards,UsePipes,ValidationPipe,Post, Query,} from '@nestjs/common';
import type { Request } from 'express';

import { AgentService } from './agent.service';
import { AgentGuard } from './agent.guard';
import { EmployeeUpdateDto } from '../employee/DTOs/employeeUpdate.dto';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';
import { TicketCommentEntity } from 'src/entities/ticketComment.entity';

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



    @Get('tickets/status/:status')
    @UseGuards(AgentGuard)
    GetTicketsByStatus(@Req() request: AuthRequest, @Param('status') status: TicketStatus) {
        return this.agentService.GetTicketsByStatus(request.user.id, status);
    }

    @Get('tickets/:ticketId')
    @UseGuards(AgentGuard)
    GetTicket(
        @Param('ticketId') ticketId: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.GetTicket(request.user.id, ticketId);
    }

    @Patch('tickets/status/:ticketId')
    @UseGuards(AgentGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    UpdateTicketStatus(
        @Param('ticketId') ticketId: string,
        @Body('status') status: TicketStatus,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.UpdateTicketStatus(
            ticketId,
            status,
        );
    }



    @Post('tickets/comments/:ticketId')
    @UseGuards(AgentGuard)
    CreateComment(
        @Param('ticketId') ticketId: string,
        @Body('comment') comment: string,
        @Req() request: AuthRequest,
    ) {
        return this.agentService.CreateComment(request.user.id, ticketId, comment);
    }

  @Patch('tickets/comments/:ticketId/:commentId')
  @UseGuards(AgentGuard)
  EditComment(
    @Param('ticketId') ticketId: string,
    @Param('commentId') commentId: string,
    @Body('comment') newComment: string,
    @Req() request: AuthRequest,
  ): Promise<TicketCommentEntity | null> {
    return this.agentService.EditComment(request.user.id, ticketId, commentId, newComment);
  }

    @Delete('/tickets/comments/:ticketId/:commentId')
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