import { Module } from "@nestjs/common";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { TicketEntity } from "../entities/ticket.entity";
import { TicketCommentEntity } from "../entities/ticketComment.entity";
import { AuthModule } from "../auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity,TicketEntity, TicketCommentEntity]), AuthModule],
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule{}