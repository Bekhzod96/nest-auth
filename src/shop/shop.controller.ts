import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './entities/shop.entity';
import { entryPoint } from '../common/constants';

@ApiBearerAuth()
@ApiTags('Shop')
@Controller(entryPoint + 'shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  @ApiOperation({ summary: 'Create shop' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: 'Shop successfully created.',
  })
  async create(@Body() createShopDto: CreateShopDto): Promise<Shop> {
    return this.shopService.create(createShopDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Shop,
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  findOne(@Param('id') id: number): Promise<Shop> {
    return this.shopService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All shop',
    type: [Shop],
  })
  findAll(): Promise<Shop[]> {
    console.log('Get All shops ');
    return this.shopService.findAll();
  }
}
