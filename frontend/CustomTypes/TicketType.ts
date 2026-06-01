import { TicketComment } from './TicketComment';
import {User} from './UserType'

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum Categories{
   
   Hardware= "Hardware Issue",
   Software= "Software Issue",
   Network= "Network Issue",
   Account= "Account/Login Issue",
   Asset= "Asset Request",
   General= "General Support"
}



export interface Ticket {

    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdBy: User
    assignedTo: User | null;
    category: Categories;
    comments: TicketComment[];
    resolvedAt: Date | null;
    closedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;

}