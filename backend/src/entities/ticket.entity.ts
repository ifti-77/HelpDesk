import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { TicketCommentEntity } from "./ticketComment.entity";

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum Categories{
   
   Hardware= "Hardware Issue",
   Software= "Software Issue",
   Network= "Network Issue",
   Account= "Account/Login Issue",
   Asset= "Asset Request",
   General= "General Support"
}


@Entity('tickets')
export class TicketEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 150 })
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'enum', enum: TicketStatus, default: 'OPEN' })
    status!: TicketStatus;

    @Column({ type: 'enum', enum: TicketPriority, default: 'MEDIUM' })
    priority!: TicketPriority;

    @ManyToOne(() => UserEntity, user => user.createdTickets)
    createdBy!: UserEntity;

    @ManyToOne(() => UserEntity, user => user.assignedTickets, { nullable: true })
    assignedTo!: UserEntity | null;

    @Column({ type: 'enum', enum: Categories })
    category!: Categories;

    @OneToMany(() => TicketCommentEntity, comment => comment.ticket)
    comments!: TicketCommentEntity[];

    @Column({ type: 'timestamp', nullable: true })
    resolvedAt!: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    closedAt!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}