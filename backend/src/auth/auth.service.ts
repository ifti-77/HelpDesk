import { BadRequestException, Body, Injectable, InternalServerErrorException, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
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

            const { email, password } = loginDto;

            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new BadRequestException('Invalid email');
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                throw new BadRequestException('Invalid password');
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

            throw new BadRequestException('Login failed');
        }
    }
}