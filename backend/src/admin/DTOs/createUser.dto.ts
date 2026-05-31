import { UserRole} from "../../entities/user.entity";
import { IsEmail, IsEnum, IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto{

        @IsNotEmpty()
        name!: string;

        @IsNotEmpty()
        @IsEmail()
        email!: string;

        @IsNotEmpty()
        @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, { message: 'Password must be at least 6 characters long and contain both letters and numbers' })
        password!: string;
    
        @IsNotEmpty()
        @IsEnum(UserRole)
        role!: UserRole;

}