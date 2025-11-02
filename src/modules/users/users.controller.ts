import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDTO } from './DTOs/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get('view-profile')
  @ApiBearerAuth()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RoleGuard)
  async viewProfileService(@Req() req: Request, @Res() res: Response) {
    const authuser = req['authUser'];
    const results = await this.UsersService.viewProfile(authuser);
    return res.status(200).json({ results });
  }

  @Post('update-profile')
  @ApiBearerAuth()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, RoleGuard)
  async updateProfileService(
    @Body() body: UpdateUserDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authuser = req['authUser'];
    const results = await this.UsersService.updateProfile(authuser, body);
    return res.status(200).json({ results });
  }
}
