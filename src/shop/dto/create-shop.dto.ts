import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShopDto {
  @ApiProperty({ description: 'Shop Name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Address' })
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty({ description: 'Geolocation' })
  @IsOptional()
  @IsString()
  readonly geolocation: string;

  @ApiProperty({ description: 'Type' })
  @IsOptional()
  @IsString()
  readonly type: string;

  @ApiProperty({ description: 'Category' })
  @IsString()
  readonly productCategories: string;

  @ApiProperty({ description: 'Contact Deatils' })
  @IsOptional()
  @IsJSON()
  readonly contactDetails: object;
}
