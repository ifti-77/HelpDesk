import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TicketEntity } from "./ticket.entity";
import { TicketCommentEntity } from "./ticketComment.entity";
import * as bcrypt from 'bcrypt';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class UserEntity{

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email!: string;

    @Column({ type: 'text' })
    passwordHash!: string;

    @Column({ type: 'enum', enum: UserRole, default: 'EMPLOYEE' })
    role!: UserRole;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @OneToMany(() => TicketEntity, ticket => ticket.createdBy)
    createdTickets!: TicketEntity[];
    @OneToMany(() => TicketEntity, ticket => ticket.assignedTo)
    assignedTickets!: TicketEntity[];

    @OneToMany(() => TicketCommentEntity, comment => comment.user)
    comments!: TicketCommentEntity[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    async hashPassword() {
        if (this.passwordHash) {
            const salt = await bcrypt.genSalt(10);
            this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        }
      }
}