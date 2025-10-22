import { Controller, ValidationPipe } from '@nestjs/common';
import { Body, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDTO, LoginDTO, verifyAccountDTO } from './DTOs/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: SignUpDTO,
  ) {
    const results = await this.authService.signUpService(body);
    return results;
  }

  @Post('login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const results = await this.authService.loginService(body);
    return res.status(200).json({ results });
  }

  @Post('verify-account')
  async verifyAccount(@Body() body: verifyAccountDTO, @Res() res: Response) {
    const results = await this.authService.verifyAccountService(body);
    return res.status(200).json({ results });
  }
}
