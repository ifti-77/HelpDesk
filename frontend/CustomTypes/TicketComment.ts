import { Ticket } from "./TicketType";
import { User } from "./UserType";



export interface TicketComment {

    id: string;

    ticket: Ticket

    user: User


    message: string;


    createdAt: Date;
    updatedAt: Date;
}