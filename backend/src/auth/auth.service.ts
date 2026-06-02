import { BadGatewayException, BadRequestException, Body, Injectable, InternalServerErrorException, Res, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity, UserRole } from "../entities/user.entity";
import { Repository } from "typeorm";
import { LoginDTO } from "./DTOs/login.dto";
import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService) { }

    async Login(loginDto: LoginDTO, res: Response): Promise<{ message: string } | null> {
        try {

            const user = await this.userRepository.findOne({ where: { email: loginDto.email } })
            if (!user) {
                throw new BadRequestException('No user with this email found')
            }

            const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash)
            if (!isMatch) {
                throw new BadRequestException('Password is incorrect')
            }

            if(!user.isActive)
            {
                throw new BadRequestException('You Account has been Deactivated, please contact Admin')
            }

            const payload = { id: user.id, role: user.role }
            const accessToken = await this.jwtService.signAsync(payload);

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000, 
            });

            return { message: 'Login successful' };
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            throw error
        }
    }

    async GetCurrentUser(req: Request): Promise<{ id: string, role: UserRole } | null> {

        try {

            const token = this.ExtractToken(req);

            if (!token) {
                throw new UnauthorizedException('Please login first');
            }
            const payload = await this.jwtService.verify(token)

            if (!payload?.id || !payload?.role) {
                throw new BadRequestException('Invalid token payload');
            }
            return { id: payload.id, role: payload.role }

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            return null;
        }

    }

    ExtractToken(req: Request): string | undefined {

        const tokenFromCookie = req.cookies?.access_token
        if (tokenFromCookie) {
            return tokenFromCookie
        }

        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;

    }
}