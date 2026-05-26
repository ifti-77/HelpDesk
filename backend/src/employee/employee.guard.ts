import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../entities/user.entity';


@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Please login first');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!payload?.id || !payload?.role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      if (payload.role !== UserRole.EMPLOYEE) {
        throw new ForbiddenException('Only employees can access this route');
      }

      request['user'] = payload;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}