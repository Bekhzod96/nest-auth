import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { Merchant } from './entities/merchant.entity';
import jwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { entryPoint } from '../common/constants';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

// @UseGuards(jwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Merchant')
@Controller(entryPoint)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  @ApiOperation({ summary: 'Create merchant' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 201,
    description: 'Merchant successfully created.',
  })
  async create(
    @Body() createMerchantDto: CreateMerchantDto,
  ): Promise<Merchant> {
    return this.merchantService.createNewMerchant(createMerchantDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Merchant,
  })
  @ApiResponse({
    status: 404,
    description: 'Merchant not found',
  })
  findOne(@Param('id') id: number): Promise<Merchant> {
    return this.merchantService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All merchant',
    type: [Merchant],
  })
  findAll(): Promise<Merchant[]> {
    return this.merchantService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    return this.merchantService.update(id, updateMerchantDto);
  }
}
