import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationEntity } from "src/entities/organization.entity";
import { UserEntity } from "src/entities/user.entity";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";

@Module({
    imports:[ TypeOrmModule.forFeature([OrganizationEntity, UserEntity]) ],
    controllers: [OrganizationController],
    providers: [OrganizationService],
    exports: []
})
export class OrganizationModule {}