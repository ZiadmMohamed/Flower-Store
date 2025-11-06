import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserType } from '../users/schema/user.schema';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from '../users/schema/user.types';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async createCart(
    @Body() createCartDto: CreateCartDto,
    @GetUser() user: UserType,
  ) {
    await this.cartService.createCart(createCartDto, user.id);

    return {
      message: 'Cart created successfully',
    };
  }
}
