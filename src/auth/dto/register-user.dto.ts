import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { mailRegex } from '../../common/constants';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Valid Mail address',
  })
  @IsNotEmpty()
  @Matches(mailRegex, {
    message: 'This is not Valid Mail address',
  })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description:
      "Hashed Password(Don't handle plain text password over internet)",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
