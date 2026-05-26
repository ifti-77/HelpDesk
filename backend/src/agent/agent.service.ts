import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserEntity, UserRole } from '../entities/user.entity';
import {
  TicketEntity,
  TicketPriority,
  TicketStatus,
} from '../entities/ticket.entity';
import { TicketCommentEntity } from '../entities/ticketComment.entity';

import { EmployeeUpdateDto } from '../employee/DTOs/employeeUpdate.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,

    @InjectRepository(TicketCommentEntity)
    private readonly ticketCommentRepository: Repository<TicketCommentEntity>,
  ) {}

  private async getAgentById(agentId: string): Promise<UserEntity> {
    const agent = await this.userRepository.findOne({
      where: {
        id: agentId,
        role: UserRole.AGENT,
        isActive: true,
      },
    });

    if (!agent) {
      throw new UnauthorizedException('Agent not found or inactive');
    }

    return agent;
  }

  private async getTicketById(ticketId: string): Promise<TicketEntity> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id: ticketId,
      },
      relations: {
        createdBy: true,
        assignedTo: true,
        comments: {
          user: true,
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async GetAgentProfile(agentId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        id: agentId,
        role: UserRole.AGENT,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async UpdateAgentProfile(
    agentId: string,
    updatedAgent: EmployeeUpdateDto,
  ): Promise<UserEntity | null> {
    const agent = await this.getAgentById(agentId);

    agent.name = updatedAgent.name;

    const existingEmailUser = await this.userRepository.findOne({
      where: {
        email: updatedAgent.email,
      },
    });

    if (existingEmailUser && existingEmailUser.id !== agentId) {
      throw new BadRequestException('Email already in use');
    }

    agent.email = updatedAgent.email;

    const savedAgent = await this.userRepository.save(agent);

    delete (savedAgent as any).passwordHash;

    return savedAgent;
  }

  async UpdateAgentPassword(
    agentId: string,
    updatepassword: string,
  ): Promise<UserEntity | null> {
    if (!updatepassword || updatepassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const agent = await this.getAgentById(agentId);

    agent.passwordHash = await bcrypt.hash(updatepassword, 10);

    const savedAgent = await this.userRepository.save(agent);

    delete (savedAgent as any).passwordHash;

    return savedAgent;
  }

  async GetAllTickets(agentId: string): Promise<TicketEntity[] | null> {
    await this.getAgentById(agentId);

    return this.ticketRepository.find({
      relations: {
        createdBy: true,
        assignedTo: true,
        comments: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async GetAssignedTickets(agentId: string): Promise<TicketEntity[] | null> {
    await this.getAgentById(agentId);

    return this.ticketRepository.find({
      where: {
        assignedTo: {
          id: agentId,
        },
      },
      relations: {
        createdBy: true,
        assignedTo: true,
        comments: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async GetUnassignedTickets(agentId: string): Promise<TicketEntity[] | null> {
    await this.getAgentById(agentId);

    return this.ticketRepository.find({
      where: {
        assignedTo: undefined,
      },
      relations: {
        createdBy: true,
        assignedTo: true,
        comments: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async GetTicket(
    agentId: string,
    ticketId: string,
  ): Promise<TicketEntity | null> {
    await this.getAgentById(agentId);

    return this.getTicketById(ticketId);
  }

  async UpdateTicketStatus(
    agentId: string,
    ticketId: string,
    status: TicketStatus,
  ): Promise<TicketEntity | null> {
    await this.getAgentById(agentId);

    if (!Object.values(TicketStatus).includes(status)) {
      throw new BadRequestException('Invalid ticket status');
    }

    const ticket = await this.getTicketById(ticketId);

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Closed ticket status cannot be changed');
    }

    ticket.status = status;

    if (status === TicketStatus.RESOLVED) {
      ticket.resolvedAt = new Date();
    }

    if (status === TicketStatus.CLOSED) {
      ticket.closedAt = new Date();
    }

    return this.ticketRepository.save(ticket);
  }

  async AssignTicketToMe(
    agentId: string,
    ticketId: string,
  ): Promise<TicketEntity | null> {
    const agent = await this.getAgentById(agentId);

    const ticket = await this.getTicketById(ticketId);

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Closed ticket cannot be assigned');
    }

    ticket.assignedTo = agent;

    if (ticket.status === TicketStatus.OPEN) {
      ticket.status = TicketStatus.IN_PROGRESS;
    }

    return this.ticketRepository.save(ticket);
  }

  async UpdateTicketPriority(
    agentId: string,
    ticketId: string,
    priority: TicketPriority,
  ): Promise<TicketEntity | null> {
    await this.getAgentById(agentId);

    if (!Object.values(TicketPriority).includes(priority)) {
      throw new BadRequestException('Invalid ticket priority');
    }

    const ticket = await this.getTicketById(ticketId);

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Closed ticket priority cannot be changed');
    }

    ticket.priority = priority;

    return this.ticketRepository.save(ticket);
  }

  async CreateComment(
    agentId: string,
    ticketId: string,
    comment: string,
  ): Promise<boolean> {
    if (!comment || comment.trim().length < 1) {
      throw new BadRequestException('Comment is required');
    }

    const agent = await this.getAgentById(agentId);
    const ticket = await this.getTicketById(ticketId);

    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException('Cannot comment on a closed ticket');
    }

    const newComment = this.ticketCommentRepository.create({
      ticket,
      user: agent,
      message: comment.trim(),
    });

    await this.ticketCommentRepository.save(newComment);

    return true;
  }

  async GetComments(
    agentId: string,
    ticketId: string,
  ): Promise<TicketCommentEntity[] | null> {
    await this.getAgentById(agentId);

    await this.getTicketById(ticketId);

    return this.ticketCommentRepository.find({
      where: {
        ticket: {
          id: ticketId,
        },
      },
      relations: {
        user: true,
        ticket: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async DeleteComment(
    agentId: string,
    ticketId: string,
    commentId: string,
  ): Promise<boolean> {
    await this.getAgentById(agentId);

    const comment = await this.ticketCommentRepository.findOne({
      where: {
        id: commentId,
        ticket: {
          id: ticketId,
        },
      },
      relations: {
        ticket: true,
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== agentId) {
      throw new ForbiddenException('You can delete only your own comment');
    }

    await this.ticketCommentRepository.delete(comment.id);

    return true;
  }
}