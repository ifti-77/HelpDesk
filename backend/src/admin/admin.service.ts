import {BadRequestException,ForbiddenException,Injectable,NotFoundException,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserEntity, UserRole } from '../entities/user.entity';
import {TicketEntity,TicketPriority,TicketStatus,} from '../entities/ticket.entity';
import { TicketCommentEntity } from '../entities/ticketComment.entity';

import { EmployeeUpdateDto } from '../employee/DTOs/employeeUpdate.dto';
import { TicketCreateDto } from '../employee/DTOs/ticketCreate.dto';
import { CreateUserDto } from './DTOs/createUser.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,

    @InjectRepository(TicketCommentEntity)
    private readonly ticketCommentRepository: Repository<TicketCommentEntity>,
  ) {}

  private async getAdminById(adminId: string): Promise<UserEntity> {
    const admin = await this.userRepository.findOne({
      where: {
        id: adminId,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found or inactive');
    }

    return admin;
  }

  private async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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

  async GetAdminProfile(adminId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        id: adminId,
        role: UserRole.ADMIN,
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

  async UpdateAdminProfile(
    adminId: string,
    updatedAdmin: EmployeeUpdateDto,
  ): Promise<UserEntity | null> {
    const admin = await this.getAdminById(adminId);

    if ((updatedAdmin as any).name !== undefined) {
      admin.name = (updatedAdmin as any).name;
    }

    if ((updatedAdmin as any).email !== undefined) {
      const existingEmailUser = await this.userRepository.findOne({
        where: {
          email: (updatedAdmin as any).email,
        },
      });

      if (existingEmailUser && existingEmailUser.id !== adminId) {
        throw new BadRequestException('Email already in use');
      }

      admin.email = (updatedAdmin as any).email;
    }

    const savedAdmin = await this.userRepository.save(admin);

    delete (savedAdmin as any).passwordHash;

    return savedAdmin;
  }

  async UpdateAdminPassword(
    adminId: string,
    updatepassword: string,
  ): Promise<UserEntity | null> {
    if (!updatepassword || updatepassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const admin = await this.getAdminById(adminId);

    admin.passwordHash = await bcrypt.hash(updatepassword, 10);

    const savedAdmin = await this.userRepository.save(admin);

    delete (savedAdmin as any).passwordHash;

    return savedAdmin;
  }

  async CreateUser(adminId: string, userData: CreateUserDto): Promise<UserEntity | null> {
    await this.getAdminById(adminId);

    if (!userData.name || !userData.email || !userData.password) {
      throw new BadRequestException('Name, email and password are required');
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    if (
      userData.role &&
      !Object.values(UserRole).includes(userData.role)
    ) {
      throw new BadRequestException('Invalid user role');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      name: userData.name,
      email: userData.email,
      passwordHash: hashedPassword,
      role: userData.role ?? UserRole.EMPLOYEE,
    });

    const savedUser = await this.userRepository.save(user);

    delete (savedUser as any).passwordHash;

    return savedUser;
  }

  async GetUsers(adminId: string): Promise<UserEntity[] | null> {
    await this.getAdminById(adminId);

    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async GetUser(
    adminId: string,
    userId: string,
  ): Promise<UserEntity | null> {
    await this.getAdminById(adminId);

    return this.userRepository.findOne({
      where: {
        id: userId,
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

  async UpdateUser(
    adminId: string,
    userId: string,
    updatedUser: EmployeeUpdateDto,
  ): Promise<UserEntity | null> {
    await this.getAdminById(adminId);

    const user = await this.getUserById(userId);

    if ((updatedUser as any).name !== undefined) {
      user.name = (updatedUser as any).name;
    }

    if ((updatedUser as any).email !== undefined) {
      const existingEmailUser = await this.userRepository.findOne({
        where: {
          email: (updatedUser as any).email,
        },
      });

      if (existingEmailUser && existingEmailUser.id !== userId) {
        throw new BadRequestException('Email already in use');
      }

      user.email = (updatedUser as any).email;
    }

    const savedUser = await this.userRepository.save(user);

    delete (savedUser as any).passwordHash;

    return savedUser;
  }

  async UpdateUserRole(
    adminId: string,
    userId: string,
    role: UserRole,
  ): Promise<UserEntity | null> {
    await this.getAdminById(adminId);

    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException('Invalid user role');
    }

    const user = await this.getUserById(userId);

    if (adminId === userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('You cannot remove your own admin role');
    }

    user.role = role;

    const savedUser = await this.userRepository.save(user);

    delete (savedUser as any).passwordHash;

    return savedUser;
  }

  async UpdateUserStatus(
    adminId: string,
    userId: string,
    isActive: boolean,
  ): Promise<UserEntity | null> {
    await this.getAdminById(adminId);

    const user = await this.getUserById(userId);

    if (adminId === userId && isActive === false) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }

    user.isActive = isActive;

    const savedUser = await this.userRepository.save(user);

    delete (savedUser as any).passwordHash;

    return savedUser;
  }

  async DeleteUser(adminId: string, userId: string): Promise<boolean> {
    await this.getAdminById(adminId);

    const user = await this.getUserById(userId);

    if (adminId === userId) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    user.isActive = false;

    await this.userRepository.save(user);

    return true;
  }

  async GetAllTickets(adminId: string): Promise<TicketEntity[] | null> {
    await this.getAdminById(adminId);

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

  async GetTicket(
    adminId: string,
    ticketId: string,
  ): Promise<TicketEntity | null> {
    await this.getAdminById(adminId);

    return this.getTicketById(ticketId);
  }

  async UpdateTicket(
    adminId: string,
    ticketId: string,
    updatedTicket: TicketCreateDto,
  ): Promise<TicketEntity | null> {
    await this.getAdminById(adminId);

    const ticket = await this.getTicketById(ticketId);

    if ((updatedTicket as any).title !== undefined) {
      ticket.title = (updatedTicket as any).title;
    }

    if ((updatedTicket as any).description !== undefined) {
      ticket.description = (updatedTicket as any).description;
    }

    if ((updatedTicket as any).priority !== undefined) {
      if (!Object.values(TicketPriority).includes((updatedTicket as any).priority)) {
        throw new BadRequestException('Invalid ticket priority');
      }

      ticket.priority = (updatedTicket as any).priority;
    }

    if ((updatedTicket as any).category !== undefined) {
      ticket.category = (updatedTicket as any).category;
    }

    return this.ticketRepository.save(ticket);
  }

  async UpdateTicketStatus(
    adminId: string,
    ticketId: string,
    status: TicketStatus,
  ): Promise<TicketEntity | null> {
    await this.getAdminById(adminId);

    if (!Object.values(TicketStatus).includes(status)) {
      throw new BadRequestException('Invalid ticket status');
    }

    const ticket = await this.getTicketById(ticketId);

    ticket.status = status;

    if (status === TicketStatus.RESOLVED) {
      ticket.resolvedAt = new Date();
    }

    if (status === TicketStatus.CLOSED) {
      ticket.closedAt = new Date();
    }

    return this.ticketRepository.save(ticket);
  }

  async AssignTicket(
    adminId: string,
    ticketId: string,
    assignedToId: string,
  ): Promise<TicketEntity | null> {
    await this.getAdminById(adminId);

    if (!assignedToId) {
      throw new BadRequestException('assignedToId is required');
    }

    const ticket = await this.getTicketById(ticketId);

    const assignedUser = await this.userRepository.findOne({
      where: {
        id: assignedToId,
        isActive: true,
      },
    });

    if (!assignedUser) {
      throw new NotFoundException('Assigned user not found or inactive');
    }

    if (
      assignedUser.role !== UserRole.AGENT &&
      assignedUser.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException('Ticket can be assigned only to AGENT or ADMIN');
    }

    ticket.assignedTo = assignedUser;

    if (ticket.status === TicketStatus.OPEN) {
      ticket.status = TicketStatus.IN_PROGRESS;
    }

    return this.ticketRepository.save(ticket);
  }

  async UpdateTicketPriority(
    adminId: string,
    ticketId: string,
    priority: TicketPriority,
  ): Promise<TicketEntity | null> {
    await this.getAdminById(adminId);

    if (!Object.values(TicketPriority).includes(priority)) {
      throw new BadRequestException('Invalid ticket priority');
    }

    const ticket = await this.getTicketById(ticketId);

    ticket.priority = priority;

    return this.ticketRepository.save(ticket);
  }

  async DeleteTicket(adminId: string, ticketId: string): Promise<boolean> {
    await this.getAdminById(adminId);

    const ticket = await this.getTicketById(ticketId);

    await this.ticketRepository.delete(ticket.id);

    return true;
  }

  async CreateComment(
    adminId: string,
    ticketId: string,
    comment: string,
  ): Promise<boolean> {
    if (!comment || comment.trim().length < 1) {
      throw new BadRequestException('Comment is required');
    }

    const admin = await this.getAdminById(adminId);

    const ticket = await this.getTicketById(ticketId);

    const newComment = this.ticketCommentRepository.create({
      ticket,
      user: admin,
      message: comment.trim(),
    });

    await this.ticketCommentRepository.save(newComment);

    return true;
  }

  async GetComments(
    adminId: string,
    ticketId: string,
  ): Promise<TicketCommentEntity[] | null> {
    await this.getAdminById(adminId);

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
    adminId: string,
    ticketId: string,
    commentId: string,
  ): Promise<boolean> {
    await this.getAdminById(adminId);

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

    await this.ticketCommentRepository.delete(comment.id);

    return true;
  }
}