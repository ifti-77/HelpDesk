import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";


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


}