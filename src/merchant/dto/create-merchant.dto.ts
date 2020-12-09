import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({
    description: 'Legal Name',
  })
  @IsString()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Reg. Number',
  })
  @IsNotEmpty()
  @IsString()
  readonly registrationNumber: string;

  @ApiProperty({
    description: 'Bank Account',
  })
  @IsOptional()
  @IsString()
  readonly bankAccountDetails?: string;

  @ApiProperty({
    description: 'Verification Number',
  })
  @IsOptional()
  @IsString()
  readonly verificationData?: string;

  @ApiProperty({
    description: 'Representatives',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly representatives?: string;

  @ApiProperty({
    description: 'Contanct Details',
  })
  @IsOptional()
  @IsString()
  readonly contactDetails?: string;

  @ApiProperty({
    description: 'Invoice Templete',
  })
  @IsOptional()
  @IsString()
  readonly invoiceTemplate?: string;
}
