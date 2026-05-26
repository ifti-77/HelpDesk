import { Module } from "@nestjs/common";
import {  AgentController,  } from "./agent.controller";
import { AgentService} from "./agent.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { TicketEntity } from "../entities/ticket.entity";
import { TicketCommentEntity } from "../entities/ticketComment.entity";
import { AuthModule } from "../auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([UserEntity,TicketEntity, TicketCommentEntity]), AuthModule],
    controllers: [AgentController],
    providers: [AgentService],
})
export class AgentModule{}