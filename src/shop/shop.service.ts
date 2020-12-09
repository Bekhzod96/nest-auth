import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './entities/shop.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}
  private readonly shop: Shop[] = [];

  async findAll() {
    return this.shopRepository.find();
  }

  create(createShopDto: CreateShopDto) {
    const shop = this.shopRepository.create(createShopDto);
    return this.shopRepository.save(shop);
  }

  async update(id: string, updateShopDto: any) {
    const shop = await this.shopRepository.preload({
      id: +id,
      ...updateShopDto,
    });
    if (!shop) {
      throw new NotFoundException(`Shop #${id} not found`);
    }
    return this.shopRepository.save(shop);
  }

  async findOne(id: number) {
    const shop = await this.shopRepository.findOne(id);
    if (!shop) {
      throw new NotFoundException(`Shop #${id} not found`);
    }
    return shop;
  }

  async remove(id: number) {
    const shop = await this.shopRepository.findOne(id);
    return this.shopRepository.remove(shop);
  }
}