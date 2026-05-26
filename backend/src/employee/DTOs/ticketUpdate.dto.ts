import { IsEnum, IsNotEmpty, Length } from "class-validator"
import { Categories, TicketPriority, TicketStatus } from "../../entities/ticket.entity";

export class TicketCreateDto{
    
    @IsNotEmpty()
    @Length(5, 150)
    title!: string;

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    @IsEnum(TicketStatus)
    status!: TicketStatus;

    @IsNotEmpty()
    @IsEnum(TicketPriority)
    priority!: TicketPriority;


    @IsNotEmpty()
    @IsEnum(Categories)
    category!: Categories;
}
