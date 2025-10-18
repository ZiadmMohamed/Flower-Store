import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepo } from 'src/modules/Repositories/user.repo';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepo,
  ) {
    console.log('AuthGuard ctor — tokenService:', !!tokenService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (!authorization)
      throw new UnauthorizedException('Authorization header is required');

    const data = this.tokenService.verifyToken(authorization, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new NotFoundException('User not found');

    request.authUser = user;
    return true;
  }
}
