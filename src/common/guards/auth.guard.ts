import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepo } from '../../modules/users/user.repo';
import { TokenService } from '../services/token.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepo,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('No Bearer Token Provided');

    const data = this.tokenService.verifyToken(token, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new NotFoundException('User not found');

    request.authUser = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
