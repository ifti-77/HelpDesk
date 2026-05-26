import {BadRequestException,Injectable,NotFoundException,UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../entities/user.entity';
import {TicketEntity,TicketStatus} from '../entities/ticket.entity';
import { TicketCommentEntity } from '../entities/ticketComment.entity';
import { EmployeeUpdateDto } from './DTOs/employeeUpdate.dto';
import { TicketCreateDto } from './DTOs/ticketCreate.dto';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(TicketEntity) private readonly ticketRepository: Repository<TicketEntity>,
        @InjectRepository(TicketCommentEntity) private readonly ticketCommentRepository: Repository<TicketCommentEntity>,
    ) { }

    private async getEmployeeById(employeeId: string): Promise<UserEntity> {
        const employee = await this.userRepository.findOne({
            where: {
                id: employeeId,
                role: UserRole.EMPLOYEE,
                isActive: true,
            },
        });

        if (!employee) {
            throw new UnauthorizedException('Employee not found or inactive');
        }

        return employee;
    }

    private async getOwnTicket(
        employeeId: string,
        ticketId: string,
    ): Promise<TicketEntity> {
        const ticket = await this.ticketRepository.findOne({
            where: {
                id: ticketId,
                createdBy: {
                    id: employeeId,
                },
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

    async GetEmployeeProfile(employeeId: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: {
                id: employeeId,
                role: UserRole.EMPLOYEE,
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

    async UpdateEmployeeProfile(employeeId: string, updatedEmployee: EmployeeUpdateDto): Promise<UserEntity | null> {
        const employee = await this.getEmployeeById(employeeId);

        if(!employee)
        {
            throw new NotFoundException('Employee not found');
        }

        employee.name = updatedEmployee.name;

        const checkingExistingEmail = await this.userRepository.findOne({where:{email: updatedEmployee.email}});

        if(checkingExistingEmail && checkingExistingEmail.id !== employeeId)
        {
            throw new BadRequestException('Email already in use');
        }
        
        employee.email = updatedEmployee.email;
        

        const savedEmployee = await this.userRepository.save(employee);

        delete (savedEmployee as any).passwordHash;

        return savedEmployee;
    }

    async UpdateEmployeePassword(
        employeeId: string,
        updatepassword: string,
    ): Promise<UserEntity | null> {
        
        if (!updatepassword || updatepassword.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters');
        }

        const employee = await this.getEmployeeById(employeeId);

        employee.passwordHash = await bcrypt.hash(updatepassword, 10);

        const savedEmployee = await this.userRepository.save(employee);

        delete (savedEmployee as any).passwordHash;

        return savedEmployee;
    }

    async CreateTicket(
        employeeId: string,
        ticketData: TicketCreateDto,
    ): Promise<TicketEntity | null> {
        const employee = await this.getEmployeeById(employeeId);

        const ticket = this.ticketRepository.create({
            ...ticketData,
            createdBy: employee,
            assignedTo: null,
            status: TicketStatus.OPEN,
        });

        return this.ticketRepository.save(ticket);
    }

    async GetTickets(employeeId: string): Promise<TicketEntity[] | null> {
        await this.getEmployeeById(employeeId);

        return this.ticketRepository.find({
            where: {
                createdBy: {
                    id: employeeId,
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

    async GetTicket(
        employeeId: string,
        ticketId: string,
    ): Promise<TicketEntity | null> {
        return this.getOwnTicket(employeeId, ticketId);
    }

    async UpdateTicket(
        employeeId: string,
        ticketId: string,
        updatedTicket: TicketCreateDto,
    ): Promise<TicketEntity | null> {
        const ticket = await this.getOwnTicket(employeeId, ticketId);

        if (ticket.status !== TicketStatus.OPEN) {
            throw new BadRequestException('Only OPEN tickets can be updated');
        }

        if ((updatedTicket as any).title !== undefined) {
            ticket.title = (updatedTicket as any).title;
        }

        if ((updatedTicket as any).description !== undefined) {
            ticket.description = (updatedTicket as any).description;
        }

        if ((updatedTicket as any).priority !== undefined) {
            ticket.priority = (updatedTicket as any).priority;
        }

        if ((updatedTicket as any).category !== undefined) {
            ticket.category = (updatedTicket as any).category;
        }

        return this.ticketRepository.save(ticket);
    }

    async DeleteTicket(employeeId: string, ticketId: string): Promise<boolean> {
        const ticket = await this.getOwnTicket(employeeId, ticketId);

        if (ticket.status !== TicketStatus.OPEN) {
            throw new BadRequestException('Only OPEN tickets can be deleted');
        }

        await this.ticketRepository.delete(ticket.id);

        return true;
    }

    async CreateComment(
        employeeId: string,
        ticketId: string,
        comment: string,
    ): Promise<boolean> {
        if (!comment || comment.trim().length < 1) {
            throw new BadRequestException('Comment is required');
        }

        const employee = await this.getEmployeeById(employeeId);
        const ticket = await this.getOwnTicket(employeeId, ticketId);

        if (ticket.status === TicketStatus.CLOSED) {
            throw new BadRequestException('Cannot comment on a closed ticket');
        }

        const newComment = this.ticketCommentRepository.create({
            ticket,
            user: employee,
            message: comment.trim(),
        });

        await this.ticketCommentRepository.save(newComment);

        return true;
    }

    async GetComments(
        employeeId: string,
        ticketId: string,
    ): Promise<string[] | null> {
        await this.getOwnTicket(employeeId, ticketId);

        const comments = await this.ticketCommentRepository.find({
            where: {
                ticket: {
                    id: ticketId,
                },
            },
            relations: {
                user: true,
            },
            order: {
                createdAt: 'ASC',
            },
        });

        return comments.map((comment) => comment.message);
    }

    async DeleteComment(
        employeeId: string,
        ticketId: string,
        commentId: string,
    ): Promise<boolean> {
        await this.getOwnTicket(employeeId, ticketId);

        const comment = await this.ticketCommentRepository.findOne({
            where: {
                id: commentId,
                ticket: {
                    id: ticketId,
                },
                user: {
                    id: employeeId,
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

        await this.ticketCommentRepository.delete(comment.id);

        return true;
    }
}