import { ConflictException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrganizationEntity } from "src/entities/organization.entity";
import { UserEntity, UserRole } from "src/entities/user.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CreateOrganizationDto } from "./DTOs/createOrganization.dto";

@Injectable()
export class OrganizationService {

    constructor(
        @InjectRepository(OrganizationEntity) private readonly organizationRepository: Repository<OrganizationEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource
    ) { }

    async createOrganization(createOrganization: CreateOrganizationDto): Promise<Boolean> {

        const {adminName, adminEmail, adminPassword, organizationName, organizationDomain} = createOrganization
        
        try {
            const organizationDomainTrimmed = organizationDomain.trim().toLowerCase()
            const adminOrganizationEmail = `${adminEmail.trim().toLowerCase()}@${organizationDomainTrimmed}`

            const existingOrganization = await this.organizationRepository.findOne({ where: { organizationDomain: organizationDomainTrimmed } })
            if (existingOrganization) {
                throw new ConflictException(`Organization with domain ${organizationDomainTrimmed} already exists`)
            }

            const existingAdmin = await this.userRepository.findOne({ where: { email: adminOrganizationEmail } })
            if (existingAdmin) {
                throw new ConflictException(`Admin user with email ${adminOrganizationEmail} already exists`)
            }

            await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {

                const organization = await transactionalEntityManager.create(OrganizationEntity, {
                    organizationName: organizationName.trim(),
                    organizationDomain: organizationDomainTrimmed
                })
                await transactionalEntityManager.save(organization)

                const adminUser = await transactionalEntityManager.create(UserEntity, {
                    name: adminName.trim(),
                    email: adminOrganizationEmail,
                    passwordHash: adminPassword,
                    role: UserRole.ADMIN,
                    organization: organization
                })
                await transactionalEntityManager.save(adminUser)
            })

            return true
        } catch (error) {
            if(error instanceof HttpException) {
                throw error
            }
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while creating the organization'
            throw new InternalServerErrorException(`Failed to create organization-\n ${errorMessage}`)
        }
    }

}

