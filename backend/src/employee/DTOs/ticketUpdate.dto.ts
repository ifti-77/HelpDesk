import { IsEnum, IsIn, IsNotEmpty, Length } from "class-validator"
import { Categories, TicketPriority, TicketStatus } from "../../entities/ticket.entity";


export class TicketUpdateDto{
    
    @IsNotEmpty()
    @Length(5, 150)
    title!: string;

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    @IsEnum(TicketStatus)
    @IsIn([TicketStatus.OPEN])
    status!: TicketStatus;

    @IsNotEmpty()
    @IsEnum(TicketPriority)
    priority!: TicketPriority;


    @IsNotEmpty()
    @IsEnum(Categories)
    category!: Categories;
}
