import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { TicketEntity } from "./ticket.entity";
import { UserEntity } from "./user.entity";

@Entity('ticket_comments')
export class TicketCommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => TicketEntity, ticket => ticket.comments)
    ticket!: TicketEntity;

    @ManyToOne(() => UserEntity, user => user.comments)
    user!: UserEntity;

    @Column('text')
    message!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}