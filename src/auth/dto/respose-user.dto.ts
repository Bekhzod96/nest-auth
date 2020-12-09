import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResponseUserDto {
  @ApiProperty({ description: 'Id' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'status' })
  @IsString()
  status: string;
}
