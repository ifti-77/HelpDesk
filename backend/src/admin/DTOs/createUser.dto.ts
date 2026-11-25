import { UserRole } from "../../entities/user.entity";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches, Min, MinLength } from "class-validator";

export class CreateUserDto {

        @IsNotEmpty()
        name!: string;

        @IsNotEmpty()
        @IsString({ message: "User email prefix must be a string" })
        @Length(1, 64)
        @Matches(/^[a-zA-Z0-9._%+-]+$/, {
                message: "User email should only contain the username part before @",
        })
        email!: string;

        @IsNotEmpty()
        @MinLength(6, { message: 'Password must be at least 6 characters long' })
        password!: string;

        @IsNotEmpty()
        @IsEnum(UserRole)
        role!: UserRole;

}