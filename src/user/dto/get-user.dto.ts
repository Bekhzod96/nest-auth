import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { mailRegex } from '../../common/constants';

export class GetUserDto {
  @ApiProperty({
    description: 'Valid Mail address',
  })
  @IsOptional()
  @Matches(mailRegex, {
    message: 'This is not Valid Mail address',
  })
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description:
      "Hashed Password(Don't handle plain text password over internet)",
  })
  @IsString()
  @IsOptional()
  password?: string;
}
