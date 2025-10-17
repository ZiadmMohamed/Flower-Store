import { Controller, ValidationPipe } from '@nestjs/common';
import { Body, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDTO } from './DTOs/auth.dto';
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
}
