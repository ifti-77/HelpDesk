import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '12h' }
  })],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [JwtModule]
})
export class AuthModule { }