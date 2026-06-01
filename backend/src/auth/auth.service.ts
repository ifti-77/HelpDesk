import { BadRequestException, Body, Injectable, InternalServerErrorException, Res, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity, UserRole } from "../entities/user.entity";
import { Repository } from "typeorm";
import { LoginDTO } from "./DTOs/login.dto";
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService) { }

    async Login(loginDto: LoginDTO, res: Response): Promise<{ message: string } | null> {
        try {

            const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
            if (!user) {
                throw new BadRequestException('No user with this email found')
            }

            const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
            if (!isMatch) {
                throw new BadRequestException('Password is incorrect')
            }

            const payload = { id: user.id, role: user.role };
            const accessToken = await this.jwtService.signAsync(payload);

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return { message: 'Login successful' };
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            throw error
        }
    }

    async GetCurrentUser(res: Response): Promise<{ id: string, role: UserRole } | null> {

        try {

            const token = res.req.cookies?.access_token;

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
}