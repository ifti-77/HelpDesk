import { TicketComment } from "./TicketComment";
import { Ticket } from "./TicketType";

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

export interface User{

    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdTickets: Ticket[];
    assignedTickets: Ticket[];
    comments: TicketComment[];
}