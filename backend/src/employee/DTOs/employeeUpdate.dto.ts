import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class EmployeeUpdateDto{

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!:string
}