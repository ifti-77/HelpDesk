import { IsEmail, IsNotEmpty, IsString, Length, Matches, maxLength, MinLength } from "class-validator";

export class CreateOrganizationDto {

    @IsNotEmpty()
    @IsString({ message: "Admin name must be a string" })
    @Length(2, 100)
    adminName!: string

    @IsNotEmpty()
    @IsString({ message: "Admin email prefix must be a string" })
    @Length(1, 64)
    @Matches(/^[a-zA-Z0-9._%+-]+$/, {
        message: "Admin email should only contain the username part before @",
    })
    adminEmail!: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters" })
    adminPassword!: string

    @IsNotEmpty()
    @IsString({ message: "Organization name must be a string" })
    @Length(2, 100)
    organizationName!: string

    @IsNotEmpty()
    @IsString({ message: "Organization domain must be a string" })
    @Matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid domain format" })
    organizationDomain!: string

}