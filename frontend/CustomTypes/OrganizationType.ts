import { User } from "./UserType";

export interface Organization 
{

    id: string
    organizationName: string
    organizationDomain: string
    organizationEmployees: User[] | null

}