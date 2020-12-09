import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Postgres } from '../common/enums/';
import { Repository } from 'typeorm';
import {
  CreateMerchantDto,
  ResponseMerchantDto,
  UpdateMerchantDto,
} from './dto';
import { Merchant } from './entities/merchant.entity';

@Injectable()
export class MerchantService {
  logger = new Logger('MerchantService');
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}
  private readonly merchant: Merchant[] = [];

  async findAll() {
    return this.merchantRepository.find();
  }

  async createNewMerchant(createMerchantDto: CreateMerchantDto) {
    let merchant: Merchant;
    try {
      merchant = await this.merchantRepository.create(createMerchantDto);
      await this.merchantRepository.save(merchant);
      this.logger.verbose(
        `Merchant #${merchant.id}- ${merchant.name} Created Successfully`,
      );
    } catch (err) {
      if (err.code == Postgres.Duplicated) {
        this.logger.verbose(
          `Merchant "${JSON.stringify(
            createMerchantDto,
          )}" already exist in system`,
        );
        throw new ConflictException(
          `Merchant #${JSON.stringify(createMerchantDto)} alreadt exist`,
        );
      } else {
        this.logger.warn(
          `Can\'t create merchant: ${JSON.stringify(createMerchantDto)}`,
          err.stack,
        );
        throw new InternalServerErrorException("Can't create Merchant");
      }
    }
    return merchant;
  }

  async update(
    id: number,
    updateMerchantDto: UpdateMerchantDto,
  ): Promise<ResponseMerchantDto> {
    const merchant = await this.merchantRepository.preload({
      id: +id,
      ...updateMerchantDto,
    });
    if (!merchant) {
      throw new NotFoundException(`Merchant #${id} not found`);
    }
    this.logger.verbose(`Merchant #${id} has been updated`);
    return this.merchantRepository.save(merchant);
  }

  async findOne(id: number) {
    const merchant = await this.merchantRepository.findOne(id);
    if (!merchant) {
      throw new NotFoundException(`Merchant #${id} not found`);
    }
    return merchant;
  }

  async remove(id: number) {
    const merchant = await this.merchantRepository.findOne(id);
    try {
      this.merchantRepository.remove(merchant);
    } catch (err) {
      this.logger.verbose(`Merchnat #${merchant.id} has been removed`);
    }
    return;
  }
}
