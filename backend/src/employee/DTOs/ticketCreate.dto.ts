import { IsEnum, IsNotEmpty, Length } from "class-validator"
import { Categories, TicketPriority } from "../../entities/ticket.entity";

export class TicketCreateDto{
    
    @IsNotEmpty()
    @Length(5, 150)
    title!: string

    @IsNotEmpty()
    @Length(10, 500)
    description!: string

    @IsNotEmpty()
    @IsEnum(TicketPriority)
    priority!: TicketPriority


    @IsNotEmpty()
    @IsEnum(Categories)
    category!: Categories
}
