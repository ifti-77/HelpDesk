import { IsEmail, IsNotEmpty, Matches } from 'class-validator'

export class LoginDTO {
    
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'Password must be at least 8 characters long and contain at least one letter and one number' })
    password!: string;
}
