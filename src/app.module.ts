import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MerchantModule } from './merchant/merchant.module';
import { ShopModule } from './shop/shop.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    MerchantModule,
    ShopModule,
    AuthModule,
  ],
})
export class AppModule {}
