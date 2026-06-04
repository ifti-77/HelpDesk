import { UserRole} from "../../entities/user.entity";
import { IsEmail, IsEnum, IsNotEmpty, Matches, Min, MinLength } from "class-validator";

export class CreateUserDto{

        @IsNotEmpty()
        name!: string;

        @IsNotEmpty()
        @IsEmail()
        email!: string;

        @IsNotEmpty()
        @MinLength(6, { message: 'Password must be at least 6 characters long' })
        password!: string;
    
        @IsNotEmpty()
        @IsEnum(UserRole)
        role!: UserRole;

}