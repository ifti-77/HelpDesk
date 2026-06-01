import { Controller, Post, Res, Body, HttpCode, HttpStatus, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./DTOs/login.dto";
import type { Response } from "express";
import { UserRole } from "../entities/user.entity";


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    Login(@Body() loginDto:LoginDTO, @Res({passthrough: true}) res: Response): Promise< { message: string } | null> {
        
        return this.authService.Login(loginDto, res);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    Logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        return { message: 'Logged out successfully' };
    }

    @Get('check-logged-in-user')
    GetCurrentUser(@Res({passthrough: true}) res: Response): Promise<{ id: string, role: UserRole } | null>  {
        return this.authService.GetCurrentUser(res);
    }


}