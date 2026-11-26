import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { TicketEntity } from "./ticket.entity";


@Entity('organizations')
export class OrganizationEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'varchar', length: 100 })
    organizationName!: string

    @Column({ type: 'varchar', length: 150, unique: true })
    organizationDomain!: string

    @OneToMany(() => UserEntity, (user) => user.organization)
    organizationEmployees!: UserEntity[]

    @OneToMany(() => TicketEntity, (ticket) => ticket.organization, {nullable: true})
    tickets!: TicketEntity[]


}