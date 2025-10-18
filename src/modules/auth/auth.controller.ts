import {
  Controller,
  Get,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Body, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDTO, LoginDTO } from './DTOs/auth.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

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

  @Get('getuser')
  @ApiBearerAuth()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RoleGuard)
  async getUser(@Req() req: Request, @Res() res: Response) {
    const authuser = req['authUser'];
    const results = await this.authService.getUserService(authuser);
    return res.status(200).json({ results });
  }
}
