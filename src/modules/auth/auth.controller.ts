import { Controller, ValidationPipe } from '@nestjs/common';
import { Body, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDTO, LoginDTO } from './DTOs/auth.dto';
import { ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiProperty({ type: SignUpDTO })
  async signup(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: SignUpDTO,
    @Res() res: Response,
  ) {
    const results = await this.authService.signUpService(body);
    return res.status(201).json({ results });
  }

  @Post('login')
  async login(@Body() body: LoginDTO, @Res() res: Response) {
    const results = await this.authService.loginService(body);
    return res.status(200).json({ results });
  }
}
